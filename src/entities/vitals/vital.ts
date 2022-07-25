import { BaseEntity, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Patient from "../patients/patient";
import { vital_type } from "../../enums/enum";
import UtilSever from "../../utils/util";
/**
 * @description Host schema            
 */
@Entity('vitals')
class Vital extends BaseEntity {
    @PrimaryGeneratedColumn()
    _id!: string;

    @Column({
        nullable: false,
        type: "enum",
        enum: vital_type,
    })
    vital_type!: string;

    @Column({
        nullable: false
    })
    value!: string;

    @Column({
        nullable: false,
    })
    interpretation!: string;

    @Column({
        type: "date",
        nullable: true
    })
    first_day_of_last_circle!: Date;

    @Column({
        type: "date",
        nullable: true
    })
    full_term_date!: Date;

    @Column({
        nullable: true
    })
    due_in_days: number;

    @Column({
        default: false
    })
    delivered!: boolean;

    @Column()
    description!: string;

    @ManyToOne(() => Patient, (patient) => patient.vital)
    @JoinColumn()
    patient!: Patient;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    /**
    * @description create a vital for a patient
    * @param {object} vital - vital object sent from the client
    */
    static async addVital(data: any, patient: string): Promise<void> {
        try {
            const Manager = this.getRepository().manager;
            return Manager.transaction(async transactionalEntityManager => {
                const vital = await transactionalEntityManager.create(Vital, data);
                vital.patient = patient
                if (data.first_day_of_last_circle) {
                    const us = new UtilSever();
                    const full_term_date = await us.calculateGestation(new Date(vital["first_day_of_last_circle"]));
                    vital["full_term_date"] = full_term_date;
                    vital["due_in_days"] = await us.calculateDueDays(full_term_date);
                }
                await transactionalEntityManager.save(vital);
                return vital;
            })
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }


    static async updateVital(data: any, _id: string, patient: any): Promise<any> {
        try {
            const updates = Object.keys(data);
            console.log("type", typeof updates, updates);
            const allowedupdates = [
                "vital_type",
                "value",
                "interpretation",
                "description",
                "first_day_of_last_circle"
            ];
            const Manager = Vital.getRepository().manager;
            const vital = await Manager.findOne(Vital, {where: {_id, patient: {_id: patient._id}}});
            if (!vital) {
                throw new Error("Vital not found");
            }
            const isvalidoperation = updates.every((update) => {
                return allowedupdates.includes(update);
            });
            if (!isvalidoperation) {
                throw new Error({ error: "Invalid updates" } as unknown as string);
            }
            updates.forEach((update) => {
                vital[update] = data[update];
            });
            if (updates.includes('first_day_of_last_circle')) {
                const us = new UtilSever();
                const full_term_date = await us.calculateGestation(new Date(vital["first_day_of_last_circle"]));
                vital["full_term_date"] = full_term_date;
                vital["due_in_days"] = await us.calculateDueDays(full_term_date);
            }
            await Manager.save(vital);
            return vital;
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

}

export default Vital