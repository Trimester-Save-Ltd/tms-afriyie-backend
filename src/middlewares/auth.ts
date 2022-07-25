import jwt from 'jsonwebtoken';
import Patient from '../entities/patients/patient';
import { Response, NextFunction } from 'express';
import { JwtPayload } from "../interfaces/jwtpayload";
import { IPatientRequest } from "../interfaces/request";

/**
 * @description = autorization middleware to verify the user 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next - calls the next action in the middleware chain
 */
const auth = async (req: IPatientRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")!.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.SET_JWT_SECRET!) as JwtPayload;
        //const user = await User.findOneBy({_id: decoded._id, "tokens.token": token,});
        // const user = await User.find({ where: { _id: decoded._id, tokens: { token: token } } });
        const patient = await Patient.findOne({ where: { _id: decoded._id } });
        // console.log(user)
        if (!patient) {
            throw new Error();
        }
        req.token = token;
        req.patient = patient;
        next();
    } catch (error) {
        res.status(401).send({ code: 401, error: "please provide authentication" });
    }
};

export default auth;