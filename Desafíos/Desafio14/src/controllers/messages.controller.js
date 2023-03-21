import messagesService from '../services/messages.service.js'

const toSocketMessages = async () => {
    return await messagesService.getNormalized();
}

const insertMessage =  async (message) => {
    await messagesService.insertMessage(message);
}

export default {
    toSocketMessages,
    insertMessage
};