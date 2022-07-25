import { Router } from "express";
import auth from "../middlewares/auth";
import MulterUtil from "../utils/upload";
import { add_file, update_file, get_file_by_id, get_patient_files, delete_file } from "../controllers/vault";

const vaultRoute = Router();
const mu = new MulterUtil().uploads();

vaultRoute.post("/vault/add_file", mu.single('upload'), auth, add_file);
vaultRoute.patch("/vault/update_file/:id", mu.single('upload'), auth, update_file);
vaultRoute.delete("/vault/delete/:id", auth, delete_file);
vaultRoute.get("/vault/patient_files", auth, get_patient_files);
vaultRoute.get("/vault/:id", auth, get_file_by_id)


export default vaultRoute;