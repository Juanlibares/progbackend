import { ChatRepo } from "../persistence/repos/chat.repo.js";

const persistence = new ChatRepo();

const getNormalized = async () => {
    return await persistence.getNormalized();
}

const insertMessage =  async (message) => {
    return await persistence.save(message);
}

export default {
    getNormalized,
    insertMessage
}