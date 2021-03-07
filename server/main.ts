import * as ws from "ws"
import * as types from "../types";

const wss = new ws.Server({
    "port": 8080
})

wss.on("connection", (socket) => {
    function send(data: types.recMessages): void {
        socket.send(JSON.stringify(data))
    }

    function broadcast(data: object): void {
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

    socket.on("message", (data) => {
        var _data: types.recMessages = JSON.parse(data.toString());
        //delete _data.intent;

        if (_data.intent && _data.content) {
            switch (_data.intent) {
                case "message":
                    broadcastAllButSender({ "intent": _data.intent, "content": { "data": _data.content.data, "userid": _data.content.userid }})
                    break;
            }
        }
    })
})
