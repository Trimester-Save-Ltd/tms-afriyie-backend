import { randomUUID } from "crypto";
import TwilioService from "../../services/sms";
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import Patient from "./patient";


/**
 * @description User verification schema            
 */
@Entity('patientsverification')
class Patientverification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({
        unique: true,
        nullable: true
    })
    emailverificationcode!: string;

    @Column({
        default: false
    })
    emailverified!: boolean;

    @OneToOne(() => Patient, patient => patient.patientverification)
    @JoinColumn()
    patient!: Patient;

    /**
    * 
    * @returns {string} - code to be used to verify user email
    */
    generateEmailVerificationCode(): string {
        const patientverification = this;  //BUG new instance of userverification is not been created correctly
        const verificationcode = randomUUID();
        // console.log(verificationcode);
        patientverification.emailverificationcode = verificationcode;
        return verificationcode;
    }

    /**
    * @description - generate and send verification code to user phone using twilio verify service
    * @param {string} phone - user phone number
    * @returns {string} - code to be used to verify user phone
    */
    async generatePhoneVerificationCode(phone: string): Promise<object> {  //TODO uncomment this
        const ts = new TwilioService();
        const twillostatus = await ts.twiliogenerateandsendtoken(phone, "sms");
        return twillostatus;
    }


    /**
    * @param {string} verifier - phone number that received the verification code
    * @param {string} code - verification code been verified
    * @returns {object} - response object from the twilio verify service verifytoken operation
    */
    static async verifyphone(verifier: string, code: string): Promise<object> {
        const ts = new TwilioService();
        const verifystatus = await ts.twilioverifytoken(verifier, code);
        if (verifystatus.status !== "approved") {
            throw new Error("Verification code is invalid");
        }
        return verifystatus;
    }


    /**
    * @description - 
    * @param {string} code - verification code
    * @returns {object} - userverification object
    */
    static async verifyemail(code: string): Promise<any> {
        const patientverifycode = await Patientverification.findOneBy({ emailverificationcode: code });
        if (!patientverifycode) {
            throw new Error("Verification code is invalid");
        }
        if (patientverifycode.emailverified) {
            throw new Error("Verification code is already used");
        }
        patientverifycode.emailverified = true;
        await patientverifycode.save();
        return patientverifycode;
    }

}

export default Patientverification;
