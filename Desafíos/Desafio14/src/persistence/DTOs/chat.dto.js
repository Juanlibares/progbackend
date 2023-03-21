export default class ChatDTO {
    constructor({ author, date, text, id }) {
        this.author = author
        this.date = date
        this.text = text
        this.id = id
    }
}

export function transformToDTO(messages) {
    if (Array.isArray(messages)) {
        return messages.map(m => new ChatDTO(m))
    } else {
        return new ChatDTO(messages)
    }
}