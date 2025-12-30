import asyncio
import websockets

async def test_connection():
    uri = "ws://localhost:59101"
    try:
        async with websockets.connect(uri) as websocket:
            print(f"Successfully connected to {uri}")
            await websocket.send('{"type":"ping"}')
            print("Sent ping")
            await websocket.close()
            print("Closed connection")
    except Exception as e:
        print(f"Failed to connect: {e}")

asyncio.run(test_connection())
