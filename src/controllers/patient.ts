import { Request, Response } from "express";
import { IPatientRequest } from "../interfaces/request";
import Patient from "../entities/patients/patient";
import Patientverification from "../entities/patients/patientVerification";
import TwilioService from "../services/sms";
import UtilSever from "../utils/util";
import { throwTwilioAndGenericErrorMessage, throwTypeOrmEntityFieldError, throwTypeOrmEntityNotFoundErrorMessage, throwTypeOrmQueryFailedErrorMessage } from "../utils/error";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { ValidationError } from "class-validator";


/**
 * @description - Register a new user
 * @param {Request} req - request object from the request body
 * @param {Response} res - response object to send a response back to the client
 * @example - localhost:3000/api/v1/register_user
 * @example - request body - {}
 * }
 * @returns {object} - returns an object with patient verification details
 */
async function register_patient(req: Request, res: Response): Promise<void> {
    try {
        const patient = await Patient.createPatient(req.body);
        // const token = await user.registrationprocessing(); //NOTE call this method off the user entity instead of using beforeinsert hook
        // await patient.save();
        res.status(201).send({ code: 201, message: 'registration successful. verification token sent', result: patient });
    } catch (err) {
        // console.log('errr22', err,  err[0].constraints, err[0] instanceof ValidationError, err instanceof QueryFailedError);
        if (err instanceof QueryFailedError) {
            const errMsg = throwTypeOrmQueryFailedErrorMessage(err);
            res.status(400).send({ code: 400, error: errMsg });
        }
        else if (err[0] instanceof ValidationError) {
            const errMsg = throwTypeOrmEntityFieldError(err);
            res.status(400).send({ code: 400, error: errMsg });
        }
        else res.status(400).send({ code: 400, error: throwTwilioAndGenericErrorMessage(err) });
    }
}


/**
 * @description verify patient registration email
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function verify_email(req: Request, res: Response): Promise<void> {
    try {
        const emailverify = await Patientverification.verifyemail(req.query.code as string);
        await Patient.verifyEmail(emailverify.user_id, "verify_email"); // FIXME check if this method accepting 2nd arguments is still useful
        res.status(200).send({ code: 200, message: 'email verification successful', result: emailverify });
    } catch (err) {
        console.log(err);
        res.status(400).send({ code: 400, error: err });  // as error to infer the err
    }
}


/**
 * @description verify patient registration phone
 * @param {Request} req - request object
 * @param {Response} res - response object to send a response back to the client
 */
async function verify_phone(req: Request, res: Response): Promise<void> {
    try {
        await Patientverification.verifyphone(req.body.phone as string, req.body.code as string);
        const patient = await Patient.findOneByOrFail({ phone: req.body.phone as string });
        const data = await Patient.verifyPhone(patient!._id, "verify_phone"); // FIXME check if this method accepting 2nd arguments is still useful
        res.status(200).send({ code: 200, message: 'phone verification successful', result: data });
    } catch (err) {
        if (err instanceof EntityNotFoundError) {
            const errMsg = throwTypeOrmEntityNotFoundErrorMessage(err);
            res.status(400).send({ code: 400, error: errMsg });
        }
        else res.status(400).send({ code: 400, error: throwTwilioAndGenericErrorMessage(err) });  // as error to infer the err
    }
}


/**
 * @description - Login a patient into the system
 * @param {*} req request object sent from the client/patient
 * @param {*} res - response object sent to the client/patient
 */
async function login_patient(req: Request, res: Response): Promise<void> {
    try {
        const patient = await Patient.findByCredentials(
            req.body.phone,
            req.body.password
        );
        const token = await patient.generateAuthtoken();
        res.status(200).send({ code: 200, message: "login succesful", patient });
    } catch (err) {
        res.status(401).send({ code: 401, error: (err as Error).message });
    }
}


/**
 * @description search for a patient by id or email
 * @param {object} req - request object sent from the client
 * @param {object} res - response object sent to the client
 */
async function get_patient_by_id(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const patient = await Patient.findOneByOrFail({ _id: req.params.id });
        delete patient.password;
        res.status(200).send({ code: 200, message: "patient retrive successfully", result: patient });
    } catch (err) {
        if (err instanceof EntityNotFoundError) {
            const errMsg = throwTypeOrmEntityNotFoundErrorMessage(err);
            res.status(400).send({ code: 400, error: errMsg });
        }
        else res.status(400).send({ code: 400, error: throwTwilioAndGenericErrorMessage(err) });
    }
}



/**
 * @description - update patient data
 * @param {object} req - request object sent from the client
 * @param {object} res - response object sent to the client
 */
async function update_patient(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const patient = await Patient.updateuser(req)
        res.status(200).send({ code: 200, message: "resources updated successfully", result: patient });
    } catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });
    }
}


/**
 * @description - endpoints for patient to initiate a password reset process
 * @param {object} req - request object sent from the client
 * @param {object} res - response object sent to the client
 */
async function forgotpassword(req: Request, res: Response): Promise<void> {
    try {
        req.body.phone ? await Patient.forgotpasswordSMS(req.body.phone) : await Patient.forgotpassword(req.body.email);
        res.status(201).send({ code: 201, status: "Password reset code on it way, check device" });
    }
    catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });
    }
}


/**
 * @description - reset patient password from the reset password link sent to the patient's email
 * @param {object} req - request object sent from the client 
 * @param {object} res - response object sent to the client
 */
async function resetpassword(req: Request, res: Response): Promise<void> {
    try {
        //req.query.option === "email" ? console.log("email") : console.log("phone");
        req.query.option === "email" ? await Patient.resetpassword(String(req.query.code), req.body.password) : await Patient.resetpasswordSMS(Number(req.query.code), req.body.password);
        res.status(201).send({ code: 201, message: "Password reset successfully" });
    }
    catch (err) {
        res.status(400).send({ code: 400, error: (err as Error).message });
    }
}


/**
 * @description - return the profile of currently logged in user through the request object
 * @param {*} req - request object sent from the client/user
 * @param {*} res - response object sent to the client/user
 * @returns {object} - returns a user object
 */
async function me(req: IPatientRequest, res: Response): Promise<void> {
    
    res.status(200).send({ code: 200, message: "patient profile returned successfully", result: { user: req.patient, token: req.token } }); // INFO does the profile needs to return token
}

/**
 * @description - endpoints for user to initiate a password reset process
 * @param {object} req - request object sent from the client/user, it contains all user informations
 * @param {object} res - response object sent to the client/user
 * @returns {object} - returns a user object
 */
async function changepassword(req: IPatientRequest, res: Response): Promise<void> {
    try {
        const patient = await Patient.findOneByOrFail({ _id: req.patient._id })!;
        if (patient) {
            await patient.changepassword!(req, req.body.currentpassword, req.body.newpassword);
            //TODO send sms notification to the patient
            res.status(201).send({ code: 201, message: "Password changed successfully" });
        }
    }
    catch (err) {
        if (err instanceof EntityNotFoundError) {
            const errMsg = throwTypeOrmEntityNotFoundErrorMessage(err);
            res.status(401).send({ code: 401, error: errMsg });
        }
        else res.status(400).send({ code: 400, error: throwTwilioAndGenericErrorMessage(err) });
    }
}


/**
 * @description - resend verification token to user phone
 * @param req - request object sent from the client/user
 * @param res - response object sent to the client/user
 */
async function send_verification_code(req: Request, res: Response): Promise<void> {
    try {
        await Patient.findOneByOrFail({ phone: req.body.phone })!;
        const ts = new TwilioService();
        const status = await ts.twiliogenerateandsendtoken(req.body.phone as string, "sms");
        res.status(201).send({ code: 201, message: "phone verification code sent", result: status });
    } catch (err) {
        if (err instanceof EntityNotFoundError) {
            const errMsg = throwTypeOrmEntityNotFoundErrorMessage(err);
            res.status(401).send({ code: 401, error: errMsg });
        }
        else res.status(400).send({ code: 400, error: throwTwilioAndGenericErrorMessage(err) });
    }
}

/**
 * @description - resend v
 * @param req - request object sent from the client/user that should contain the patient phone
 * @param res 
 */
async function sms_verification_token(req: Request, res: Response): Promise<void> {
    try {
        const ts = new TwilioService();
        const code = new UtilSever().generateToken(6);
        const status = await ts.sendSMS(req.body.phone as string, String(code));
        res.status(201).send({ code: 201, message: "phone verification code sent", result: status });
    } catch (err) {
        //TODO add error handling here
        res.status(400).send({ code: 400, error: (err as Error).message });
    }
}

export { register_patient };
export { verify_email };
export { verify_phone };
export { login_patient };
export { get_patient_by_id };
export { update_patient };
export { forgotpassword };
export { resetpassword };
export { me }
export { send_verification_code };
export { changepassword };
export { sms_verification_token }
