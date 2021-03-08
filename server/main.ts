import * as ws from "ws"
import * as types from "../types";
import * as config from "./config.json";

var requiresPassword: boolean = config.roomPW != "" ? true : false

const wss = new ws.Server({
    "port": config.serverPort
})

wss.on("connection", (socket) => {

    function send(data: types.recMessages): void {
        socket.send(JSON.stringify(data))
    }

    /*
    function broadcast(data: types.recMessages): void {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
    */

    function broadcastAllButSender(data: types.recMessages): void {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws.OPEN && client != socket) {
                client.send(JSON.stringify(data));
            }
        });
    }

    send({ "intent": "serverData", "content": {"data": { "greeting": config.roomGreeeting, "reqPassword": requiresPassword, "roomName": config.roomName}, "userid": null} })

    socket.on("message", (data) => {
        var _data: types.recMessages = JSON.parse(data.toString());
        //delete _data.intent;

        if (_data.intent && _data.content) {
            switch (_data.intent) {
                case "message":
                    //if not a blank message continue
                    if (_data.content.data != "") {

                        //if the room requires a password, check password and send message if correct, if room does not require a password then just let send
                        if (requiresPassword == true) {
                            if (_data.content.password == config.roomPW) {
                                broadcastAllButSender({ "intent": _data.intent, "content": { "data": _data.content.data, "userid": _data.content.userid }})
                                
                            }
                        } else {
                            broadcastAllButSender({ "intent": _data.intent, "content": { "data": _data.content.data, "userid": _data.content.userid }})
                        }
                    }
                    break;
                case "checkPassword":
                    send({ "intent": _data.intent, "content": { "data": (_data.content.data == config.roomPW ? true : false), "userid": _data.content.userid } })
            }
        }
    })
})
