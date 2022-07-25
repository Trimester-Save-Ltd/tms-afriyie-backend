import { Request, Response } from "express";
import { IPatientRequest } from "../interfaces/request";
import Vital from "../entities/vitals/vital";
import Budget from "../entities/budgets/budget";
import TwilioService from "../services/sms";
import { StringMappingType } from "typescript";

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
async function add_budget(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const budget = await Budget.addBudget(req.body, req.patient._id);
        // const token = await user.registrationprocessing(); //NOTE call this method off the user entity instead of using beforeinsert hook
        res.status(201).send({ code: 201, message: 'Budget Creation Successful', result: budget });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function update_budget(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const budgetupdate = await Budget.updateBudget(req.body, req.params.id as string, req.patient._id);
        res.status(200).send({ code: 200, message: 'budget updated successfully', result: budgetupdate });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function delete_budget(req: Request, res: Response): Promise<void> {
    try {
        await Budget.delete({ _id: req.params.id as string });
        res.status(200).send({ code: 200, message: 'budget deleted successfully' });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function get_budget_by_id(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const budgetdata = await Budget.findOneByOrFail({ _id: req.params.id, patient: { _id: req.patient._id} });
        res.status(200).send({ code: 200, message: 'budget data retrive successfully', result: budgetdata });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function get_patient_budget(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const patientbudgetdata = await Budget.findBy({ patient: { _id: req.patient!._id} });
        res.status(200).send({ code: 200, message: 'budget data retrive successfully', result: patientbudgetdata });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });  // as error to infer the err
    }
}


export { add_budget }
export { update_budget }
export { delete_budget }
export { get_patient_budget }
export { get_budget_by_id }
