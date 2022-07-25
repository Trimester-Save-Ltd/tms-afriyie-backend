import { Request } from 'express';

/**
 * @description = extends the request interface for users to add the user object and token
 */
interface IPatientRequest extends Request {
    patient: any,
    token: any
}

/**
 * @description = extends the request interface for admins to add the admin object and token
 */
interface IAdminRequest extends Request {
    admin: any,
    token: any
}


export { IPatientRequest, IAdminRequest };