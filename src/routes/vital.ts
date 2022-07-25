import { Router } from "express";
import auth from "../middlewares/auth";
import { add_vital, update_vital, get_vital_by_id, get_patient_vital, delete_vital } from "../controllers/vital";

const vitalRoute = Router();

vitalRoute.post("/vital/add_vital", auth, add_vital);
vitalRoute.patch("/vital/update/:id", auth, update_vital);
vitalRoute.delete("/vital/delete/:id", auth, delete_vital);
vitalRoute.get("/vital/patient_vitals", auth, get_patient_vital);
vitalRoute.get("/vital/:id", auth, get_vital_by_id)

export default vitalRoute;