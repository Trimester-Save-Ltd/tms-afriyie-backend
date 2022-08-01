import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Patient from "../patients/patient";
import { vital_type } from "../../enums/enum";
import CloudinaryService from "../../services/cloudinary";

/**
 * @description Vault schema            
 */
@Entity('vaults')
class Vault extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    _id!: string;

    // @Column({
    //     nullable: false,
    //     type: "enum",
    //     enum: vital_type,
    // })
    // vital_type!: string;

    @Column({
        nullable: false
    })
    description!: string;

    @Column({
        nullable: false,

    })
    file_url!: string;


    @Column({
        nullable: false,
        unique: true
    })
    asset_id!: string;

    @Column({
        nullable: false
    })
    cloudinary_id!: string;

    @ManyToOne(() => Patient, (patient) => patient.vital)
    @JoinColumn()
    patient!: Patient;

    /**
    * @description add a new vault item for a patient
    * @param {object} vital - vital object sent from the client
    */
    static async addFile(data: any, patient: string): Promise<void> {
        try {
            const cs = new CloudinaryService();
            const Manager = this.getRepository().manager;
            return Manager.transaction(async transactionalEntityManager => {
                const result = await cs.uploadfile(data.file.path);
                const vault = await transactionalEntityManager.create(Vault, data.body);
                console.log("valut", result);
                vault.file_url = result.secure_url;
                vault.cloudinary_id = result.public_id;
                vault.asset_id = result.asset_id;
                vault.patient = patient;
                await transactionalEntityManager.save(vault);
                return vault;
            })
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

    static async updateVault(data: any, cloudinary_id: string, patient: any): Promise<any> {
        try {
            const updates = Object.keys(data.body);
            const allowedupdates = [
                "description"
            ];
            const isvalidoperation = updates.every((update) => {
                return allowedupdates.includes(update);
            });
            const Manager = Vault.getRepository().manager;
            if (data.file) {
                const cs = new CloudinaryService();
                const result = await cs.updatefile(cloudinary_id, data.file.path);
                const vault = await Manager.findOneBy(Vault, { cloudinary_id });
                // const vault = await Vault.findOneBy({cloudinary_id})
                if (result && vault._id) {
                    vault.file_url = result.secure_url;
                    vault.cloudinary_id = result.public_id;
                    vault.asset_id = result.asset_id;
                }
                if (!isvalidoperation) {
                    throw new Error({ error: "Invalid updates" } as unknown as string);
                }
                updates.forEach((update) => {
                    vault[update] = data.body[update];
                });
                await Manager.save(vault);
                return vault;
            }
            const vault = await Manager.findOne(Vault, { where: { cloudinary_id: cloudinary_id } });
            if (!vault) {
                throw new Error("vault not found");
            }
            if (!isvalidoperation) {
                throw new Error({ error: "Invalid updates" } as unknown as string);
            }
            updates.forEach((update) => {
                vault[update] = data.body[update];
            });
            await Manager.save(vault);
            return vault;
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }


}

export default Vault;