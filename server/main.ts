import * as ws from "ws"

const wss = new ws.Server({
    "port": 8080
})

interface recMessages {
    "intent": string,
    "content": string
}

var usercount = 0;

wss.on("connection", (socket) => {
    function send(data: object): void {
        socket.send(JSON.stringify(data))
    }

    function broadcast(data: object): void {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }

    function broadcastAllButSender(data: object) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws.OPEN && client != socket) {
                client.send(JSON.stringify(data));
            }
        });
    }

    socket.on("message", (data) => {
        var _data: recMessages = JSON.parse(data.toString());
        //delete _data.intent;

        if (_data.intent && _data.content) {
            switch (_data.intent) {
                case "getUser":
                    send({ "intent": _data.intent, "content": usercount })
                    usercount++;
                    break;
                case "message":
                    broadcastAllButSender({ "intent": "message", "content": _data.content })
            }
        }
    })
})
