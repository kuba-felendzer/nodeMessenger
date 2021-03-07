//interface for recived data from ws
interface recMessages {
    "intent": string,
    "content": {
        "data": string | object,
        "userid": string
    }
}

interface serverConfig {
    "serverPort": number,
    "roomName": string,
    "roomPassword": string
}

interface dataFromServer {
    "greeting": {
        "color": string,
        "text": string
    },
    "reqPassword": boolean
}

export { recMessages, serverConfig, dataFromServer }