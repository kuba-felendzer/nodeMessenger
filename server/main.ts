import * as ws from "ws"
import * as types from "../types";
import * as config from "./config.json";

const wss = new ws.Server({
    "port": config.serverPort
})

wss.on("connection", (socket) => {

    function send(data: types.recMessages): void {
        socket.send(JSON.stringify(data))
    }

    function broadcast(data: types.recMessages): void {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }

    function broadcastAllButSender(data: types.recMessages): void {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws.OPEN && client != socket) {
                client.send(JSON.stringify(data));
            }
        });
    }

    send({ "intent": "serverData", "content": {"data": { "greeting": config.roomGreeeting, "reqPassword":(config.roomPW != "" ? true : false) }, "userid": null} })

    socket.on("message", (data) => {
        var _data: types.recMessages = JSON.parse(data.toString());
        //delete _data.intent;

        if (_data.intent && _data.content) {
            switch (_data.intent) {
                case "message":
                    if (_data.content.data != "") {
                        broadcastAllButSender({ "intent": _data.intent, "content": { "data": _data.content.data, "userid": _data.content.userid }})
                    }
                    break;
            }
        }
    })
})
