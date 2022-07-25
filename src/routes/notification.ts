import { Router } from "express";
import auth from "../middlewares/auth";
import { read_notification, get_notification } from "../controllers/notificattion";

const notificationRoute = Router();


notificationRoute.get("/notification/:id", auth, get_notification);
notificationRoute.patch("/notification/read_notification/:id", auth, read_notification);


export default notificationRoute;