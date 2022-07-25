import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Patient from "../patients/patient";
import { notification_type } from "../../enums/enum";

/**
 * @description Notification schema            
 */
@Entity('notifications')
class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    _id!: string;

    @Column({
        nullable: false,
        type: "enum",
        enum: notification_type,
    })
    notification_type!: string;

    @Column({
        nullable: false,
        type: 'jsonb'
    })
    content!: string;

    @Column({
        nullable: true
    })
    alert!: string;

    @Column({
        nullable: false,
        default: false
    })
    read!: boolean;

    @ManyToOne(() => Patient, (patient) => patient.vital)
    @JoinColumn()
    patient!: Patient;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;


    static async readNotification(id: string) {
        try {
            const notification = await Notification.findOneByOrFail({ _id: id, read: false });
            if (notification) {
                notification.read = true;
                await notification.save();
                return notification;
            }
        }
        catch (err) {
            throw new Error((err as Error).message);
        }
    }

    static async getNotification(id: string) {
        try {
            const notification = await Notification.findOneOrFail({ where: { _id: id }, select: ['_id', 'notification_type', 'alert', 'created_at', 'updated_at'] });
            return notification;
        }
        catch (err) {
            throw new Error((err as Error).message);
        }
    }


    static async deleteNotification(id: string) {
        try {
            const notification = await Notification.findOneBy({ _id: id });
            await notification.remove();
            return notification;
        }
        catch (err) {
            throw new Error((err as Error).message);
        }
    }
}

export default Notification;
