import * as chalk from "chalk";
import * as config from "./config.json";
import * as ws from "ws"

//open WS
const connection = new ws(config.serverAddr)

//WS open flag
var socketOpen = false

//console.log but it don't add a \n to the end
function writeWithoutNewline(text: string): void {
    process.stdout.write(text)
}

//runs when WS successfully opens
function ready(): void {
    writeWithoutNewline(chalk.blue(">"))
}

//sends data over the ws
function send(data: object): void {
    if (socketOpen == true) {
        connection.send(JSON.stringify(data))
    }
}

//on text input
process.stdin.on("data", (data) => {
    var textrecived: string = data.toString().replace("\r\n", "")
    console.log(`${chalk.red("ME")}: ${textrecived}`)
    ready()
    send({ "intent": "message", "content": textrecived })
})

//when the WS opens 
connection.on("open", () => {
    ready()
    socketOpen = true;
})

//
connection.on("message", (msg) => {
    var data = JSON.parse(msg.toString())
    process.stdout.clearLine(0)
    console.log(`${chalk.red("anonymous")}: ${chalk.yellow(data.content)}`)
    ready()
})