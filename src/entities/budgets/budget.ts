import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Patient from "../patients/patient";
import { budget_type } from "../../enums/enum";

/**
 * @description Budget schema            
 */
@Entity('budgets')
class Budget extends BaseEntity {
    @PrimaryGeneratedColumn()
    _id!: string;

    @Column({
        nullable: false,
        type: "enum",
        enum: budget_type,
    })
    budget_type!: string;

    @Column({
        nullable: false
    })
    description!: string;

    @Column({
        nullable: true,
    })
    amount!: number;

    // @Column({
    //     nullable: false
    // })
    // cloudinary_id!: string

    @ManyToOne(() => Patient, (patient) => patient.budget)
    @JoinColumn()
    patient!: Patient;

    /**
    * @description create a budget for a patient
    * @param {object} data - budget object sent from the client
    * @param {object} patient - patient id sent from the client
    */
    static async addBudget(data: any, patient: string): Promise<void> {
        try {
            const Manager = this.getRepository().manager;
            return Manager.transaction(async transactionalEntityManager => {
                const budget = await transactionalEntityManager.create(Budget, data);
                budget.patient = patient
                await transactionalEntityManager.save(budget);
                return budget;
            })
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }


    static async updateBudget(data: any, id: string, patient: any): Promise<any> {
        try {
            const updates = Object.keys(data);
            const allowedupdates = [
                "budget_type",
                "amount",
                "description",
            ];
            const Manager = Budget.getRepository().manager;

            const budget = await Manager.findOne(Budget, { where: { _id: id, patient: { _id: patient} } });
            if (!budget) {
                throw new Error("Budget not found");
            }
            const isvalidoperation = updates.every((update) => {
                return allowedupdates.includes(update);
            });
            if (!isvalidoperation) {
                throw new Error({ error: "Invalid updates" } as unknown as string);
            }
            updates.forEach((update) => {
                budget[update] = data[update];
            });
            await Manager.save(budget);
            return budget;
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

}

export default Budget;