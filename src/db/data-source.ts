import "reflect-metadata"
import { DataSource } from "typeorm"
import Patient from "../entities/patients/patient";
import Patientverification from "../entities/patients/patientVerification";
import Vault from "../entities/vaults/vault";
import Appointment from "../entities/appointments/appointment";
import Vital from "../entities/vitals/vital"
import Notification from "../entities/notifications/notification";
import Budget from "../entities/budgets/budget";


// localDS for the app to connect to
const localDS = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "allaye",
    database: "tms-cms",
    synchronize: true,
    logging: true,
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/db/migrations/*.ts"],
    subscribers: [],
})

// remoteDS for the app to connect to
const remoteDS = new DataSource({
    type: "postgres",
    host: process.env.HEROKU_PG_HOST as string,
    port: process.env.HEROKU_PG_PORT as unknown as number,
    username: process.env.HEROKU_PG_USER as string,
    password: process.env.HEROKU_PG_PASSWORD as string,
    database: process.env.HEROKU_PG_DATABASE as string,
    ssl: true,
    extra: {
        ssl: {
            "rejectUnauthorized": false
        }
    },
    synchronize: true,
    logging: true,
    entities: [Patient, Patientverification, Vault, Appointment, Vital, Notification, Budget],
    migrations: ["src/db/migrations/*.ts"],
    // subscribers: ["src/db/subscriber/*.ts"],
})

const PgDataSource = process.env.NODE_ENV == "development" ? remoteDS : localDS;




// /**
//  * @description a function to create a datasource and connect to the database
//  * @param entity database models
//  * @returns a datasource
//  */
// const PgDataSource = (entity: Array<any> = []): DataSource => {
//     if (process.env.NODE_ENV !== "production") {
//         const datasource = new DataSource(
//             {
//                 type: "postgres",
//                 host: "localhost",
//                 port: 5432,
//                 username: "postgres",
//                 password: "allaye",
//                 database: "tms-cms",
//                 synchronize: true,
//                 logging: true,
//                 entities: entity,
//                 migrations: ["src/db/migrations/*.ts"],
//                 // subscribers: ["src/db/subscriber/*.ts"],
//             }
//         )
//         return datasource
//     }
//     else {
//         return new DataSource(
//             {
//                 type: "postgres",
//                 host: process.env.HEROKU_PG_HOST as string,
//                 port: process.env.HEROKU_PG_PORT as unknown as number,
//                 username: process.env.HEROKU_PG_USER as string,
//                 password: process.env.HEROKU_PG_PASSWORD as string,
//                 database: process.env.HEROKU_PG_DATABASE as string,
//                 ssl: true,
//                 extra: {
//                     ssl: {
//                         "rejectUnauthorized": false
//                     }
//                 },
//                 synchronize: true,
//                 logging: true,
//                 entities: entity,
//                 migrations: ["src/db/migrations/*.ts"],
//                 // subscribers: ["src/db/subscriber/*.ts"],
//             }
//         )
//     }
// };
export default PgDataSource;