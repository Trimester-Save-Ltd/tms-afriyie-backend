import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Patient from "../patients/patient";

/**
 * @description Host schema            
 */
@Entity('appointments')
class Appointment extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    @Column({
        nullable: false,
        default: false
    })
    is_done!: boolean;

    @Column({
        nullable: false,
    })
    event!: string;

    @Column({

    })
    location!: string;

    @Column()
    appointment_start_date_time!: Date;

    @Column()
    appointment_end_date_time!: Date;

    @Column()
    comment!: string;

    @ManyToOne(() => Patient, (patient) => patient.appointment)
    @JoinColumn()
    patient!: Patient;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    /**
    * @description create an appointment for a patient
    * @param {object} appointment - vital object sent from the client
    */
    static async addAppointment(data: any, patient: string): Promise<void> {
        try {
            const Manager = this.getRepository().manager;
            return Manager.transaction(async transactionalEntityManager => {
                const appointment = await transactionalEntityManager.create(Appointment, data);
                appointment.patient = patient
                await transactionalEntityManager.save(appointment);
                return appointment;
            })
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }


    static async updateAppointment(data: any, id: string, patient: any): Promise<any> {
        try {
            const updates = Object.keys(data);
            const allowedupdates = [
                "is_done",
                "event",
                "location",
                "appointment_start_date_time",
                "appointment_end_date_time",
                "comment"
            ];
            const Manager = Appointment.getRepository().manager;
            // const patientvitaldata = await Vital.find({ where: { patient: { _id: req.patient._id } } });

            const appointment = await Manager.findOne(Appointment, { where: { _id: id, patient: { _id: patient} } });
            console.log("appon", appointment);
            if (!appointment) {
                throw new Error("Appointment not found");
            }
            const isvalidoperation = updates.every((update) => {
                return allowedupdates.includes(update);
            });
            if (!isvalidoperation) {
                throw new Error({ error: "Invalid updates" } as unknown as string);
            }
            updates.forEach((update) => {
                appointment[update] = data[update];
            });
            await Manager.save(appointment);
            return appointment;
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

}

export default Appointment