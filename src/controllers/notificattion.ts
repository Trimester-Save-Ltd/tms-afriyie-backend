import { Request, Response } from "express";
import { IPatientRequest } from "../interfaces/request";
import Notification from "../entities/notifications/notification";





/**
 * @description - read patient notification
 * @param {Request} req - request object from the request body
 * @param {Response} res - response object to send a response back to the client
 * @returns {object} - returns an object with information of the notification
 */
async function read_notification(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const notification = await Notification.readNotification(req.params.id as string);
        res.status(200).send({ code: 200, message: 'Notification read Successfully', result: notification });
    } catch (err) {
        res.status(400).send({ code: 400, error: 'could not find requested resources or resources have been read already' });
    }
}


/**
 * @description return patient notification by id
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function get_notification(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const notification = await Notification.getNotification(req.params.id as string);
        res.status(200).send({ code: 200, message: 'notification successfully retrieve', result: notification });
    } catch (err) {
        res.status(400).send({ code: 400, error: 'could not find requested resource' });  // as error to infer the err
    }
}


export { read_notification }
export { get_notification }
