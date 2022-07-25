import { Between, DataSource, LessThanOrEqual } from "typeorm";
import Appointment from "../entities/appointments/appointment";
import Vital from "../entities/vitals/vital";
import Patient from "../entities/patients/patient";
import Notification from "../entities/notifications/notification";
import PgDataSource from "../db/data-source";


// class NotificationJob {
//     constructor() {
//         console.log("notification job");
//         this.checkAppointment();
//         this.checkGestation();
//     }

//     public twoweeksb4birth() {
//         console.log("twoweeksb4birth");
//     }

//     public checkGestation() {
//         console.log("check gestation");
//         // const gestationData = Vital.find({ where: { vital_type: "GE", due_in_days: LessThanOrEqual(14), delivered: true } });
//         // return gestationData.then(data => data)
//     }

//     public checkAppointment() {
//         console.log("check appointment");
//     }

// }

import { parentPort } from 'worker_threads';
import delay from 'delay';
import ms from 'ms';
import Vault from "../entities/vaults/vault";
import Budget from "../entities/budgets/budget";
import phoneverification from "../entities/patients/patientVerification";



(async () => {
    // wait for a promise to finish
    const ds = await PgDataSource.initialize();
    const Vitalrepo = ds.getRepository(Vital);
    const p = await Vitalrepo.find({ where: { vital_type: "GE", due_in_days: Between(0, 14), delivered: false } });
    const notidata = {
        notification_type: 'GESTATION',
        read: false,

    }
    // for (const property in p ){
    //     notidata['content'] = p[property]
    //     notidata['alert'] = `Hello in ${p[property].due_in_days} the baby is due to be delivered`
    //     await ds.getRepository(Notification).save(notidata);
    // }
    console.log('noti', notidata);

    // signal to parent that the job is done
    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
})();

// new NotificationJob()