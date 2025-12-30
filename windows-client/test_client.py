import asyncio
import websockets
import json
import socket
import time

async def test_client():
    uri = "ws://localhost:59101"
    print(f"Connecting to {uri}...")
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected!")
            
            # Test 1: Hello World
            msg = {
                "type": "text_input",
                "text": "Hello World via Voice Bridge",
                "mode": "append"
            }
            await websocket.send(json.dumps(msg))
            print("Sent: Hello World")
            
            await asyncio.sleep(1)
            
            # Test 2: Enter key
            # Not fully implemented in keyboard_controller yet, but let's assume if we send text "\n" it works?
            # Or separate implementation? The current keyboard_controller uses `type_text` which might handle \n.
            msg = {
                "type": "text_input",
                "text": "\n",
                "mode": "append"
            }
            await websocket.send(json.dumps(msg))
            print("Sent: Newline")
            
    except Exception as e:
        print(f"Connection failed: {e}")

def test_discovery():
    print("Testing UDP Discovery...")
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('', 59100))
    sock.settimeout(5)
    
    try:
        data, addr = sock.recvfrom(1024)
        print(f"Received Discovery packet: {data} from {addr}")
    except socket.timeout:
        print("Discovery timeout - No server found broadcasting on 59100")
    finally:
        sock.close()

if __name__ == "__main__":
    # Run discovery test first
    test_discovery()
    
    # Run websocket test
    asyncio.run(test_client())
