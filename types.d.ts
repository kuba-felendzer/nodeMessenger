//interface for recived data from ws
interface recMessages {
    "intent": string,
    "content": {
        "data": string | object | boolean,
        "userid": string,
        "password"?: string
    }
}

interface dataFromServer {
    "greeting": {
        "color": string,
        "text": string
    },
    "reqPassword": boolean,
    "roomName": string
}

export { recMessages, dataFromServer }