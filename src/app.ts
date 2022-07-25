import "reflect-metadata";
import fs from "fs";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
// import nubAuth from 'nub-auth';
// import Patient from "./entities/patients/patient";
// import phoneverification from "./entities/patients/patientVerification";
// import Vital from "./entities/vitals/vital";
// import Vault from "./entities/vaults/vault";
// import Budget from "./entities/budgets/budget";
// import Appointment from "./entities/appointments/appointment";
// import Notification from "./entities/notifications/notification";
import PgDataSource from "./db/data-source";
import patientRoute from "./routes/patient";
import vitalRoute from "./routes/vital";
import appointmentRoute from "./routes/appointment";
import vaultRoute from "./routes/vault";
import Api from "twilio/lib/rest/Api";
import budgetRoute from "./routes/budget";
import notificationRoute from "./routes/notification";


PgDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
const swaggerfile = fs.readFileSync("./swagger.yaml", "utf8");
const app = express();

app.use(cors({
    origin: '*' //['https://trimester-save.herokuapp.com/']
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header('origin'));
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(['/api-docs/v1'],
//     nubAuth({
//         challenge: true,
//         users: {
//             admin: 'p4ssw0rd',
//         },
//     }),
// );
app.use("/api-docs/v1",
    swaggerUi.serve,
    swaggerUi.setup(yaml.parse(swaggerfile))
);
app.use("/api/v1", patientRoute);
app.use("/api/v1", vitalRoute);
app.use("/api/v1", appointmentRoute);
app.use("/api/v1", vaultRoute);
app.use("/api/v1", budgetRoute);
app.use("/api/v1", notificationRoute);
app.get("/", (req, res) => {
    res.status(200).send('Welcome to the TMS-CRM Core API...');
});

export { app };
