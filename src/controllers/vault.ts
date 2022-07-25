import { Request, Response } from "express";
import { IPatientRequest } from "../interfaces/request";
import Vital from "../entities/vitals/vital";
import Vault from "../entities/vaults/vault";



/**
 * @description - Log a new file patient vault
 * @param {Request} req - request object from the request body
 * @param {Response} res - response object to send a response back to the client
 * @example - localhost:3000/api/v1/vault/add_file
 * @example - request form-data - {
 *  "key": "file",
 *  "description": "file secription"
 *          
 * }
 * @returns {object} - returns an object with info on the file added to vault
 */
async function add_file(req: IPatientRequest, res: Response): Promise<void> {
    try {
        console.log('req.file', req.file);
        console.log("req file path", req.file.path);
        console.log('form', req.body.description)
        const vault = await Vault.addFile(req, req.patient._id);
        // const token = await user.registrationprocessing(); //NOTE call this method off the user entity instead of using beforeinsert hook
        res.status(201).send({ code: 201, message: 'File uploaded to Vault Successful', result: vault });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });
    }
}


/**
 * @description update file stored in vault
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function update_file(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const vaultupdate = await Vault.updateVault(req, req.params.id as string, req.patient._id);
        res.status(200).send({ code: 200, message: 'vault file updated successfully', result: vaultupdate });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function delete_file(req: Request, res: Response): Promise<void> {
    try {
        await Vault.delete({ cloudinary_id: req.params.id as string });
        res.status(200).send({ code: 200, message: 'file deleted from vault successfully' });
    } catch (err) {
        res.status(400).send({ error: (err as Error).message });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function get_file_by_id(req: Request, res: Response): Promise<void> {
    try {
        const vitaldata = await Vault.findOneByOrFail({ cloudinary_id: req.params.id as string });
        res.status(200).send({ code: 200, message: 'single file retrive from vault successfully', result: vitaldata });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });  // as error to infer the err
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function get_patient_files(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const patientvitaldata = await Vault.findBy({ patient: { _id: req.patient._id} });
        res.status(200).send({ code: 200, message: 'all patient file retrieve from vault successfully', result: patientvitaldata });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });  // as error to infer the err
    }
}


export { add_file }
export { update_file }
export { delete_file }
export { get_patient_files }
export { get_file_by_id }
