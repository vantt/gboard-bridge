const dgram = require('dgram');
const WebSocket = require('ws');

// Simulation of the Android App's Logic

// 1. Discovery Phase
function scanForPC() {
    console.log("Simulating Android App: Scanning for PC...");
    return new Promise((resolve, reject) => {
        const socket = dgram.createSocket('udp4');
        
        socket.on('error', (err) => {
            console.log(`Socket error:\n${err.stack}`);
            socket.close();
            reject(err);
        });

        socket.on('message', (msg, rinfo) => {
            const message = msg.toString();
            if (message.startsWith('VOICE_TYPING_BRIDGE_SERVER')) {
                console.log(`Found Server: ${message} at ${rinfo.address}:${rinfo.port}`);
                socket.close();
                resolve(rinfo.address);
            }
        });

        socket.bind(59100, () => {
             // In Node.js dgram, we don't necessarily need to bind to receive broadcast if we are just listening? 
             // Actually broadcast listeners usually bind to the port. 
             // Windows Client broadcasts to Port 59100.
             // So we bind to 59100.
             // Note: If the Server is also bound to 59100 on the same machine (localhost), 
             // we might have issues on some OSs with SO_REUSEADDR.
             // But let's try.
        });
        
        // Timeout
        setTimeout(() => {
            console.log("Scan timeout.");
            socket.close();
            reject(new Error("Timeout scanning for PC"));
        }, 5000);
    });
}

// 2. Connection Phase
function connectToPC(address) {
    console.log(`Simulating Android App: Connecting to ${address}:59101...`);
    const ws = new WebSocket(`ws://${address}:59101`);

    ws.on('open', function open() {
        console.log('Connected to WebSocket Server!');
        
        // 3. Typing Phase
        console.log('Simulating Voice Input: "Testing again: This is the second test message!"');
        ws.send(JSON.stringify({
            type: 'text_input',
            text: "Testing again: This is the second test message!",
            mode: 'append'
        }));
        
        setTimeout(() => {
            ws.close();
            process.exit(0);
        }, 1000);
    });

    ws.on('error', (err) => {
        console.error('WebSocket Error:', err);
        process.exit(1);
    });
}

// Main Flow
(async () => {
    try {
        const address = await scanForPC();
        connectToPC(address);
    } catch (e) {
        console.error("Simulation failed:", e.message);
        // Fallback for localhost testing if discovery fails (common in loopback)
        console.log("Attempting direct localhost connection as fallback...");
        connectToPC('127.0.0.1'); 
    }
})();
