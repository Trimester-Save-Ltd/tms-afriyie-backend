import { Request, Response } from "express";
import { IPatientRequest } from "../interfaces/request";
import Vital from "../entities/vitals/vital";
import TwilioService from "../services/sms";

//DONE create a vital
//DONE fetch all vitals that belong to a patient
//DONE fetch all vitals of a specific type that belong to a patient

//TODO update patient vitals
//TODO get analytic report of a patient vitals

/**
 * @description - Log a new vital information for patient
 * @param {Request} req - request object from the request body
 * @param {Response} res - response object to send a response back to the client
 * @example - localhost:3000/api/v1/register_user
 * @example - request body - {
 *          
 * }
 * @returns {object} - returns an object with patient vital details
 */
async function add_vital(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const vital = await Vital.addVital(req.body, req.patient._id);
        // const token = await user.registrationprocessing(); //NOTE call this method off the user entity instead of using beforeinsert hook
        res.status(201).send({ code: 201, message: 'Vital Creation Successful', result: vital });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function update_vital(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const vitalupdate = await Vital.updateVital(req.body, req.params.id as string, req.patient!._id);
        res.status(200).send({ code: 200, message: 'vital updated successfully', result: vitalupdate });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function delete_vital(req: Request, res: Response): Promise<void> {
    try {
        await Vital.delete({ _id: req.params.id as string });
        res.status(200).send({ code: 200, message: 'vital delection successful'});
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function get_vital_by_id(req: Request, res: Response): Promise<void> {
    try {
        const vitaldata = await Vital.findOneByOrFail({ _id: req.params.id as string });
        res.status(200).send({ code: 200, message: 'vital retrieve successfully', result: vitaldata });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function get_patient_vital(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const patientvitaldata = await Vital.find({ where: { patient: {_id: req.patient._id}} });
        res.status(200).send({ code: 200, message: 'vital retrival successful', result: patientvitaldata });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });  // as error to infer the err
    }
}


export { add_vital }
export { update_vital }
export { delete_vital }
export { get_patient_vital }
export { get_vital_by_id }
