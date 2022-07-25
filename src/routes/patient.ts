import { Router } from "express";
import auth from "../middlewares/auth";
import { register_patient, sms_verification_token, me, login_patient, verify_email, update_patient } from "../controllers/patient";
import { resetpassword, get_patient_by_id, forgotpassword, verify_phone, send_verification_code, changepassword } from "../controllers/patient";


const patientRoute = Router();

patientRoute.post("/patient/register", register_patient);
patientRoute.get("/patient/me", auth, me);
patientRoute.post("/patient/send_verification_code", send_verification_code);
patientRoute.post("/patient/login", login_patient);
patientRoute.patch("/patient/verify_email", verify_email);
patientRoute.patch("/patient/verify_phone", verify_phone);
patientRoute.patch("/patient/update", auth, update_patient);
patientRoute.patch("/patient/change_password", auth, changepassword);
patientRoute.patch("/patient/forgot_password", forgotpassword);
patientRoute.patch("/patient/reset_password", resetpassword);
patientRoute.get("/patient/:id", auth, get_patient_by_id);
patientRoute.post("/patient/send_sms_code", sms_verification_token);

export default patientRoute
