import * as chalk from "chalk";
import * as config from "./config.json";
import * as ws from "ws"
import * as types from "../types";

//serverData
var serverData: types.dataFromServer

//name string
var name: string

//WS open flag
var socketOpen = false

//connection 
const connection = new ws(config.serverAddr)

//console.log but it don't add a \n to the end
function writeWithoutNewline(text: string): void {
    process.stdout.write(text)
}

//runs when WS successfully opens
function ready(): void {
    writeWithoutNewline(chalk.blue(">"))
}

//sends data over the ws
function send(data: types.recMessages): void {
    if (socketOpen == true) {
        connection.send(JSON.stringify(data))
    }
}

//runs everything needed to be run to get started
async function init(): Promise<void> {
    //set open flag
    socketOpen = true;

    connection.on("message", (msg) => {
        var _msg: types.recMessages = JSON.parse(msg.toString())
        if (_msg.intent == "serverData") {
            serverData = <types.dataFromServer>_msg.content.data
        }
    })

    //gets name
    name = await new Promise((resolve) => {
        console.log(chalk.white("What do you want you username to be?"))
        writeWithoutNewline(chalk.yellow(">"))

        process.stdin.on("data", (text) => {
            resolve(text.toString().replace("\r\n", ""))
        })
    })

    //greet user
    console.log(chalk.whiteBright(`Hello ${name}!`))

    //room greeting
    console.log(chalk.hex(serverData.greeting.color)(serverData.greeting.text))

    //on message
    connection.on("message", (msg) => {
        var data: types.recMessages = JSON.parse(msg.toString())
        switch (data.intent) {
            case "message":
                process.stdout.clearLine(0)
                console.log(`${chalk.red(data.content.userid)}: ${chalk.yellow(data.content.data)}`)
                ready()
                break;
        }   
    })

    //display caret
    ready()

    //on text input
    process.stdin.on("data", (data) => {
        //gets text recived
        var textrecived: string = data.toString().replace("\r\n", "")

        if (textrecived != "") {
            //show you sent data
            console.log(` ${chalk.red(`${name} (ME)`)}: ${chalk.blueBright(textrecived)}`)

            //send the message to the server
            send({ "intent": "message", "content": { "data": textrecived, "userid": name} })
        }

        //display cursor
        ready()
    })
}

//when the WS opens 
connection.on("open", () => {
    init()
})