import { messageSchema } from "../models/message.js";

class MessageService {
  //POST message
  async addMessage(messageDTO) {
    return await messageSchema.create(messageDTO);
  }

  //GET ALL messages
  async getMessages() {
    return await messageSchema.find();
  }
}

export const messageService = new MessageService();
