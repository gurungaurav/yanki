import { Router } from "express";
import { messageController } from "../controller/message.controller.js";

export const messageRoutes = Router();

messageRoutes.post("/addMessage", messageController.addMessage);
messageRoutes.get("/getMessages", messageController.getMessages);
