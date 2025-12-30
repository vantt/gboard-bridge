import asyncio
import websockets
import logging
import json
from keyboard_controller import KeyboardController

logger = logging.getLogger(__name__)

class WebSocketServer:
    def __init__(self, port=59101, keyboard_controller=None):
        self.port = port
        self.server = None
        self.keyboard_controller = keyboard_controller
        self.connected_clients = set()
        self.on_connect = None
        self.on_disconnect = None

    async def start(self):
        self.server = await websockets.serve(self.handler, "0.0.0.0", self.port)
        logger.info(f"WebSocket Server started on port {self.port}")
        # Keep the server running
        # In a real app we might want a way to stop it gracefully await self.server.wait_closed()
        
    async def stop(self):
        if self.server:
            self.server.close()
            await self.server.wait_closed()
            logger.info("WebSocket Server stopped")

    async def handler(self, websocket):
        # Register client
        self.connected_clients.add(websocket)
        client_info = websocket.remote_address
        logger.info(f"Client connected: {client_info}")
        if self.on_connect:
            self.on_connect()
        
        try:
            async for message in websocket:
                await self.process_message(message)
        except websockets.exceptions.ConnectionClosed:
            logger.info(f"Client disconnected: {client_info}")
            if self.on_disconnect:
                self.on_disconnect()
        except Exception as e:
            logger.error(f"Error in connection handler: {e}")
        finally:
            self.connected_clients.remove(websocket)

    async def process_message(self, message):
        try:
            data = json.loads(message)
            msg_type = data.get("type")
            
            if msg_type == "text_input":
                text = data.get("text", "")
                mode = data.get("mode", "append") # append or replace (not fully implemented yet)
                
                if self.keyboard_controller:
                    self.keyboard_controller.type_text(text)
                    
            elif msg_type == "ping":
                # Respond to ping if needed, or just ignore as keepalive
                pass
                
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON received: {message}")
        except Exception as e:
            logger.error(f"Error processing message: {e}")
