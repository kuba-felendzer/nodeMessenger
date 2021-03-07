//interface for recived data from ws
interface recMessages {
    "intent": string,
    "content": {
        "data": string,
        "userid": string
    }
}

export { recMessages }