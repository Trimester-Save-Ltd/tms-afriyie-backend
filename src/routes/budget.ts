import { Router } from "express";
import auth from "../middlewares/auth";
import { add_budget, update_budget, get_budget_by_id, get_patient_budget, delete_budget } from "../controllers/budget";

const budgetRoute = Router();

budgetRoute.post("/budget/add_budget", auth, add_budget);
budgetRoute.patch("/budget/update/:id", auth, update_budget);
budgetRoute.delete("/budget/delete/:id", auth, delete_budget);
budgetRoute.get("/budget/patient_budgets", auth, get_patient_budget);
budgetRoute.get("/budget/:id", auth, get_budget_by_id)

export default budgetRoute;