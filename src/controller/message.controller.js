import { successHandler } from "../handlers/success/successHandler.js";
import { messageService } from "../services/message.service.js";

class MessageController {
  addMessage = async (req, res, next) => {
    try {
      const message = req.body;

      await messageService.addMessage(message);

      return successHandler(res, 201, null, "Message sent successfully.");
    } catch (e) {
      next(e);
    }
  };

  getMessages = async (req, res, next) => {
    try {
      const messages = await messageService.getMessages();

      return successHandler(
        res,
        200,
        messages,
        "Messages fetched successfully."
      );
    } catch (e) {
      next(e);
    }
  };
}

export const messageController = new MessageController();
