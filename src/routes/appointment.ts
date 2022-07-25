import { Router } from "express";
import auth from "../middlewares/auth";
import { add_appointment, update_appointment, delete_appointment, get_appointment_by_id, get_patient_appointment } from "../controllers/appointment";

const appointmentRoute = Router();

appointmentRoute.post("/appointment/add_appointment", auth, add_appointment);
appointmentRoute.patch("/appointment/update/:id", auth, update_appointment);
appointmentRoute.delete("/appointment/delete/:id", auth, delete_appointment);
appointmentRoute.get("/appointment/patient_appointments", auth, get_patient_appointment);
appointmentRoute.get("/appointment/:id", auth, get_appointment_by_id)

export default appointmentRoute;