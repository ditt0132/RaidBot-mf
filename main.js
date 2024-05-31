const mineflayer = require('mineflayer')
const viewer = require('prismarine-viewer').mineflayer
const readline = require('readline')
const Socks = require('socks5-client')
const fs = require('node:fs')

let bots = []

function reconnect() {
    let proxy = getProxy().next().value
    const bot = mineflayer.createBot({
        username: "Reich_" + bots.length,
        auth: "offline",
        stream: Socks.createConnection({
            host: 'localhost',
            port: 25565,
            socksHost: proxy[0],
            socksPort: proxy[1]
        })
    })
    bots.push(bot)
    console.log("Connected to "+proxy)
}

for (let i = 0; i < 30; i++) {
    reconnect()
}

function* getProxy(filePath = "proxy.txt") {
    while (true) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const lines = data.split(/\r?\n/);
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine) {
                    const [proxy_ip, proxy_port] = trimmedLine.split(':');
                    yield [proxy_ip, proxy_port];
                }
            }
            console.log("proxy ended");
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
            break;
        }
    }
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
}
