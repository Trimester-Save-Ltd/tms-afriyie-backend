import { Request, Response } from "express";
import { IPatientRequest } from "../interfaces/request";
import Vital from "../entities/vitals/vital";
import Appointment from "../entities/appointments/appointment";
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
async function add_appointment(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const appointment = await Appointment.addAppointment(req.body, req.patient._id);
        // const token = await user.registrationprocessing(); //NOTE call this method off the user entity instead of using beforeinsert hook
        res.status(201).send({ code: 201, message: 'appointment Creation Successful', result: appointment });
    } catch (err) {
        res.status(400).send({ code: 400, error: 'cant create an appointment with the data provided' });
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function update_appointment(req: IPatientRequest, res: Response): Promise<void> {
    try {
        await Appointment.updateAppointment(req.body, req.params.id as string, req.patient._id);
        res.status(200).send({ code: 200, message: 'appointment updated successfully' });
    } catch (err) {
        res.status(400).send({ code: 400, error: 'appointment update operation failed' });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function delete_appointment(req: Request, res: Response): Promise<void> {
    try {
        await Appointment.delete({ _id: req.params.id as string });
        res.status(200).send({ code: 200, message: 'selected appointment deleted' });
    } catch (err) {
        res.status(400).send({ error: 'could not delete appointment' });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function get_appointment_by_id(req: Request, res: Response): Promise<void> {
    try {
        const appointmentdata = await Appointment.findOneByOrFail({ _id: req.params.id as string });
        res.status(200).send({ code: 200, message: 'appointment data retrive', result: appointmentdata });
    } catch (err) {
        res.status(400).send({ code: 400, error: 'error retriving appointment' });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function get_patient_appointment(req: IPatientRequest, res: Response): Promise<void> {
    try {
        // const patientvitaldata = await Vital.find({ where: { patient: { _id: req.patient._id } } });
        const patientappointmentdata = await Appointment.findBy({ patient: { _id: req.patient._id} });
        res.status(200).send({ code: 200, message: 'email verification successful', result: patientappointmentdata });
    } catch (err) {
        res.status(400).send({ code: 400, error: 'error retrieving appointment' });  // as error to infer the err
    }
}


export { add_appointment }
export { update_appointment }
export { delete_appointment }
export { get_appointment_by_id }
export { get_patient_appointment }
