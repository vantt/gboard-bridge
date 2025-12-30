import socket
import logging
import time
import threading
import json

logger = logging.getLogger(__name__)

class DiscoveryService:
    def __init__(self, port=59100, pc_name="VoiceBridgePC"):
        self.port = port
        self.pc_name = pc_name
        self.running = False
        self.broadcast_thread = None
        self.sock = None

    def start(self):
        self.running = True
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        self.broadcast_thread = threading.Thread(target=self._broadcast_loop, daemon=True)
        self.broadcast_thread.start()
        logger.info(f"Discovery Service started on port {self.port}")

    def stop(self):
        self.running = False
        if self.sock:
            self.sock.close()
        logger.info("Discovery Service stopped")

    def _broadcast_loop(self):
        # Format: "VOICE_TYPING_BRIDGE_SERVER|<PC_NAME>|<VERSION>"
        message = f"VOICE_TYPING_BRIDGE_SERVER|{self.pc_name}|1.0".encode('utf-8')
        while self.running:
            try:
                self.sock.sendto(message, ('<broadcast>', self.port))
                time.sleep(1) # Broadcast every second
            except Exception as e:
                logger.error(f"Broadcast error: {e}")
                time.sleep(5)
