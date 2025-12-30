import asyncio
import threading
import logging
from pystray import Icon, MenuItem, Menu
from PIL import Image, ImageDraw
import socket
import sys

from discovery_service import DiscoveryService
from websocket_server import WebSocketServer
from keyboard_controller import KeyboardController

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class VoiceTypingBridge:
    def __init__(self):
        self.running = True
        self.icon = None
        self.loop = None
        self.discovery_service = DiscoveryService()
        self.keyboard_controller = KeyboardController()
        self.websocket_server = WebSocketServer(keyboard_controller=self.keyboard_controller)
        self.websocket_server.on_connect = self.on_client_connect
        self.websocket_server.on_disconnect = self.on_client_disconnect
        
    def on_client_connect(self):
        logging.info("Client connected callback received")
        if self.icon:
            self.icon.icon = self.create_icon_image("green")
            
    def on_client_disconnect(self):
        logging.info("Client disconnected callback received")
        if self.icon:
            # Check if there are still other clients? 
            # For simplicity, if any disconnects, we might check count, but set implementation in server is simple.
            # Ideally we only turn yellow if 0 clients.
            # But the server code exposes 'connected_clients' set.
            if len(self.websocket_server.connected_clients) == 0:
                self.icon.icon = self.create_icon_image("yellow")
        
    def create_icon_image(self, color="green"):
        # Create a simple icon
        width = 64
        height = 64
        image = Image.new('RGB', (width, height), (255, 255, 255))
        dc = ImageDraw.Draw(image)
        dc.rectangle((0, 0, width, height), fill=color)
        return image

    def setup_tray(self):
        menu = Menu(
            MenuItem('Exit', self.stop_app)
        )
        self.icon = Icon("Voice Typing Bridge", self.create_icon_image("yellow"), "Voice Typing Bridge", menu)
        self.icon.run()

    def stop_app(self, icon, item):
        logger.info("Stopping application...")
        self.running = False
        
        # Stop services
        self.discovery_service.stop()
        
        # We need to stop asyncio loop which is running in another thread
        # This is a bit tricky with blocking run_forever.
        # A simple way for this toys project is to just exit sys.
        if self.icon:
            self.icon.stop()
        
        # Force exit for now as quick shutdown
        sys.exit(0)

    async def start_services(self):
        logger.info("Starting services...")
        self.discovery_service.start()
        await self.websocket_server.start()
        
        # Keep loop alive
        while self.running:
            await asyncio.sleep(1)
            
        await self.websocket_server.stop()

    def run(self):
        # Run asyncio loop in a separate thread because pystray needs to block main thread
        service_thread = threading.Thread(target=self.run_async_services, daemon=True)
        service_thread.start()
        
        logger.info("Application started. Check System Tray.")
        self.setup_tray()

    def run_async_services(self):
        try:
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)
            self.loop.run_until_complete(self.start_services())
        except Exception as e:
            logger.error(f"Error in service thread: {e}")

if __name__ == "__main__":
    app = VoiceTypingBridge()
    app.run()
