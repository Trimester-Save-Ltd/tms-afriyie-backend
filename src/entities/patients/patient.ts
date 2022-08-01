import path from 'path';
import { ValidationError, MinLength, MaxLength, IsNotEmpty, IsString, Length, validate, validateOrReject } from 'class-validator';
import { AfterInsert, BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import EmailService from "../../services/mail";
import TwilioService from "../../services/sms";
import UtilSever from "../../utils/util";
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { randomUUID } from 'crypto';
import { JwtPayload } from "../../interfaces/jwtpayload";
import { IPatientRequest } from "../../interfaces/request";
import IPatient from "../../interfaces/patient";
import Patientverification from './patientVerification';
import Vital from '../vitals/vital';
import Appointment from '../appointments/appointment';
import Vault from '../vaults/vault';
import getBaseUrl from "../../utils/baseUrl";
import Budget from '../budgets/budget';



// require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });


/**
 * @description Patient entity            
 */
@Entity('patients')
class Patient extends BaseEntity {

    @PrimaryColumn()
    _id!: string;


    @Column({
        nullable: false,
        unique: false
    })
    @IsString()
    @IsNotEmpty({ message: "Please enter your first name" })
    first_name!: string;

    @Column({
        nullable: false,
        unique: false
    })
    @IsString()
    @IsNotEmpty({ message: "Please enter your last name" })
    last_name!: string;

    @Column({
        unique: true,
        nullable: true,
    })
    email!: string;

    @Column({
        unique: true,
        nullable: false,
    })
    phone!: string;

    @Column({
        select: true
    })
    @MinLength(8, { message: "Password must be at least 6 characters long" })
    // @MaxLength(20, { message: "Password must be less than 20 characters long" })
    password!: string;

    @Column({
        default: false,
    })
    is_verified!: boolean;

    @Column({
        type: 'jsonb',
        select: false,
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    tokens!: Array<{ token: string }>;

    @Column({
        default: false,
    })
    verified!: boolean;

    @Column({
        default: false,
    })
    verify_email!: boolean;

    @Column({
        default: false,
    })
    verify_phone!: boolean;

    @Column({
        nullable: true,
    })
    resetlink!: string;

    @Column({
        nullable: true,
    })
    reset_code!: number;

    @OneToMany(() => Vital, (vital) => vital.patient)
    vital!: Vital[];

    @OneToMany(() => Appointment, (appointment) => appointment.patient)
    appointment!: Appointment[];

    @OneToMany(() => Vault, (vault) => vault.patient)
    vault!: Vault[];

    @OneToMany(() => Budget, (budget) => budget.patient)
    budget!: Budget[];

    @OneToOne(() => Patientverification, patientverification => patientverification.patient, {
        cascade: true,
        eager: true
    })
    patientverification!: Patientverification;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    /**
    * @description - patient registration processing method to run before inserting the patient into the database
    */

    @BeforeInsert()   //INFO - check if this is only called when a user is being created
    async registrationprocessing(): Promise<any> {
        try {
            const patient = this;
            patient._id = randomUUID(); //NOTE - assign a random id to the user manually, because typeorm does not give you access to the id before you save the model
            const token = jwt.sign({ _id: patient._id.toString() }, process.env.SET_JWT_SECRET!, {
                algorithm: "HS256",
                expiresIn: "7d", //TODO - work on the token expiration
            });
            if (!patient.tokens) patient.tokens = []; //NOTE - typeorm does not add the default value to the tokens array before save, so it will be undefined, so we need to add it manually before performing any operation on it.
            patient.tokens = patient.tokens.concat({ token });
            patient.password = await bcrypt.hash(patient.password, parseInt(process.env.HASH_ROUNDS!));
            return await patient /// .generateCode(); // generate all necessary verification codes
        }
        catch (err) {
            throw new Error((err as Error).message);
        }
    }


    /**
    * @description - method to verify a user
    * @param {object} patientinstance - user instance object
    * @returns {object} userverification instance
    */
    static async createPatient(data: any): Promise<any> {
        try {
            const Manager = this.getRepository().manager;
            return Manager.transaction(async transactionalEntityManager => {
                const patient = await transactionalEntityManager.create(Patient, data);
                const patientverification = transactionalEntityManager.create(Patientverification);
                await validateOrReject(patient);
                // console.log('errruur', aa[0] instanceof ValidationError, aa, ValidationError);
                // if (aa.length > 0) {
                //     throw new Error(aa[0].constraints.message);
                // }
                //await transactionalEntityManager.save(patient);
                if (patient.email) {
                    const email_token = patientverification.generateEmailVerificationCode();
                    const es = new EmailService();
                    await transactionalEntityManager.save(patient);
                    patientverification.patient = patient.id;
                    await transactionalEntityManager.save(patientverification);
                    const verificationlink = `${process.env.FRONTEND}/patient/verify_email?code=${email_token}`;
                    es.senduserregistrationemail(patient.email, verificationlink, patient.first_name);
                    const phone_data = patientverification.generatePhoneVerificationCode(patient.phone);
                    return phone_data;
                }
                await transactionalEntityManager.save(patient);
                // await transactionalEntityManager.save(patientverification);
                return patientverification.generatePhoneVerificationCode(patient.phone);
            })
        }
        catch (err) {
            throw new Error(err);
        }
    }


    /**
    * @description a method to hash user password before it is saved in raw form
    * @param {string} password - user password 
    * @returns 
    */
    static async hashPassword(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, parseInt(process.env.HASH_ROUNDS!));
        }
        catch (error) {
            throw new Error((error as Error).message);
        }
    }


    /**
    * @description - Generate auth token for patient which is attached to the patient instance and saved in the database
    * @returns {string} - JWTtoken to be attached to the user instance
    */
    async generateAuthtoken(registration: boolean = false): Promise<string> {
        const patient = this;
        const token = jwt.sign({ _id: patient._id.toString() }, process.env.SET_JWT_SECRET!, {
            algorithm: "HS256",
            expiresIn: "7d",
        });
        if (!patient.tokens) patient.tokens = []; // if the tokens array is undefined, then we need to add it manually
        patient.tokens = patient.tokens.concat({ token });
        await patient.save();
        return token;
    };


    /**
    * @description - method to generate a verification phone and email verification token
    * @param {object} userinstance - user instance object
    * @returns {object} userverification instance
    */
    async generateCode(): Promise<any> {  //TODO - uncomment this method
        // const patientid = this._id;
        // // console.log(userid);
        // const userverification = Patientverification.create({ patientid: patientid });
        // // console.log(userverification);
        // userverification.generateEmailVerificationCode();
        // //await userverification.generatePhoneVerificationCode(this.phone_number); //TODO uncomment this when the phone verification is ready
        // await userverification.save();
        // return userverification;
    };


    /**
    * @description - Find a user by the provided username and password
    * @param {string} email - email of the user
    * @param {string} password - password of the user
    * @returns {object} user instance object
    */
    static async findByCredentials(phone: string, password: string): Promise<Patient> {
        const patient = await Patient.findOneBy({ phone });
        if (!patient) {
            throw new Error("Unable to login user check credentials");
        }
        if (!patient.verify_phone) {
            throw new Error("Please verify your account");
        }
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            throw new Error("Unable to login user check credentials");
        }
        delete patient.password;
        delete patient.tokens;
        return patient;
    };


    /**
    * @description - initiate the password reset process for the user provided
    * @param {string} email - email address of the user initiating the password reset
    * @returns
    */
    static async forgotpassword(email: string): Promise<any> { // Promise<SMTPTransport.SentMessageInfo>
        //const es = new EmailService();
        const patient = await Patient.findOneBy({ email });
        if (!patient) {
            throw new Error("No User Associated with this phone");
        }
        try {
            const token = jwt.sign({ _id: patient._id.toString() }, process.env.RESET_JWT_SECRET!, {
                algorithm: "HS256",
                expiresIn: "20m",
            });
            const resetlink = `${process.env.FRONTEND}/resetpassword/${token}`;
            patient.resetlink = token;
            if (patient.email) {
                const es = new EmailService();
                await patient.save();
                return await es.sendpasswordresetemail(resetlink, patient.first_name, patient.email);
            }
        }
        catch (err) {
            throw new Error((err as Error).message);
        }
    };


    /**
     * @description - method to reset the password of the user through sms 
     * @param phone - phone number of the patient used to register
     * @returns 
     */
    static async forgotpasswordSMS(phone: string): Promise<any> {
        const patient = await Patient.findOneBy({ phone });
        if (!patient) {
            throw new Error("No User Associated with this phone");
        }
        try {
            const ts = new TwilioService();
            const code = new UtilSever().generateToken(6);
            patient.reset_code = code;
            await patient.save();
            return await ts.sendSMS(phone, `Your reset code is ${code}`);
        }
        catch (err) {
            throw new Error((err as Error).message);
        }
    }





    /**
     * @description - reset the password of the user provided
     * @param {string} token - token to be verified
     * @param {string} password - new password to be set
     * @returns {object} - user instance object
     */
    static async resetpassword(token: string, password: string): Promise<any> {
        const patient = await Patient.findOneBy({ resetlink: token });
        if (!patient) {
            throw new Error("No Reset Link Associated with this code");
        }
        try {
            const decoded = jwt.verify(token, process.env.RESET_JWT_SECRET!) as JwtPayload;
            const decodedpatient = await Patient.findOneBy({ _id: decoded._id, resetlink: token, });
            if (!decodedpatient) {
                throw new Error("No Reset Link Associated with this code");
            }
            patient.password = await Patient.hashPassword(password);
            patient.resetlink = "";
            //TODO : send email to user to notify password reset
            await patient.save();
            delete patient.password;
            delete patient.tokens;
            return patient
        }
        catch (err) {
            throw new Error((err as Error).message);
        }
    }


    /**
    * @description - reset the password of the user provided
    * @param {string} token - token to be verified
    * @param {string} password - new password to be set
    * @returns {object} - user instance object
    */
    static async resetpasswordSMS(token: number, password: string): Promise<any> {
        const patient = await Patient.findOneBy({ reset_code: token });
        if (!patient) {
            throw new Error("No Password Reset Associated with this code");
        }
        try {
            patient.password = await Patient.hashPassword(password);
            patient.reset_code = null;
            //TODO : send email to user to notify password reset
            await patient.save();
            delete patient.password;
            delete patient.tokens;
            return patient
        }
        catch (err) {
            throw new Error((err as Error).message);
        }
    }

    static async changepassword(req: IPatientRequest, currentpassword: string, newpassword: string): Promise<any> {
        const patient = await Patient.findOneBy({ _id: req.patient._id });
        if (!patient) {
            throw new Error("No User Associated with this code");
        }
        try {
            const isMatch = await bcrypt.compare(currentpassword, patient.password);
            if (!isMatch) {
                //TODO send notification email to user to notify password change failed
                throw new Error("Current Password is incorrect");
            }
            patient.password = await Patient.hashPassword(newpassword);
            await patient.save();
            //TODO send notification email to user to notify password change success
            delete patient.password;
            delete patient.tokens;
            return patient;
        }
        catch (err) {
            throw new Error((err as Error).message);
        }
    }

    /**
     * @description =
     * @param {string} userid - userid of the user
     * @param {string} verifystate - verification action/state eg. verify_email, verify_phone
     * @returns {object} - user instance object
     */
    static async verifyEmail(userid: string, verifystate: string): Promise<any> {
        const patient = await Patient.findOneBy({ _id: userid });
        if (!patient) {
            throw new Error("No User Associated with this code");
        }
        // check if the verifystate passed which is verify_email or verify_phone is already true, if yes then throw an error
        // else update the user option passed to true
        if (patient.verify_email) { // FIXME make the user verify option just email
            throw new Error(`User ${verifystate} Already Verified`);
        }
        patient.verify_email = true;
        await patient.save();
        delete patient.password
        delete patient.tokens;
        return patient;
    };

    /**
     * @description =
     * @param {string} userid - userid of the user
     * @param {string} verifystate - verification action/state eg. verify_email, verify_phone
     * @returns {object} - user instance object
     */
    static async verifyPhone(userid: string, verifystate: string): Promise<any> {
        const patient = await Patient.findOneBy({ _id: userid });
        if (!patient) {
            throw new Error("No User Associated with this code");
        }
        // check if the verifystate passed which is verify_email or verify_phone is already true, if yes then throw an error
        // else update the user option passed to true
        if (patient.verify_phone) { // FIXME make the user verify option just email
            throw new Error(`User ${verifystate} Already Verified`);
        }
        patient.verify_phone = true;
        await patient.save();
        delete patient.password
        delete patient.tokens;
        return patient;
    };


    static async updateuser(req: IPatientRequest): Promise<IPatient> {
        const updates = Object.keys(req.body);
        const allowedupdates = [
            "first_name",
            "last_name",
            "homeadress",
            "workadress",
            "ghana_card"
        ];
        const isvalidoperation = updates.every((update) => {
            return allowedupdates.includes(update);
        });
        if (!isvalidoperation) {
            throw new Error({ error: "Invalid updates" } as unknown as string);
        }
        const patient = req.patient;
        updates.forEach((update) => {
            patient[update] = req.body[update];
        });
        await patient.save();
        delete patient.password;
        delete patient.tokens;
        return patient;
    };


    async changepassword(req: IPatientRequest, currentpassword: string, newpassword: string): Promise<any> {
        const patient = await Patient.findOneBy({ _id: req.patient._id });
        if (!patient) {
            throw new Error("No patient Associated with this id");
        }
        try {
            const isMatch = await bcrypt.compare(currentpassword, patient.password);
            if (!isMatch) {
                //TODO send notification email to user to notify password change failed
                throw new Error("Current Password is incorrect");
            }
            patient.password = await Patient.hashPassword(newpassword);
            await patient.save();
            //TODO send notification email to user to notify password change success
            delete patient.password;
            delete patient.tokens;
            return patient;
        }
        catch (err) {
            throw new Error((err as Error).message);
        }
    }


    /**
    * @description - logout user from a single device or all device
    * @param {object} req req object that contains the user token, etc
    * @param {boolean} all boolen value to know if user wants to logout all connected device
    * @returns - return req object with user token removed or invalidated
    */
    static async logoutuser(req: IPatientRequest, all: boolean = false): Promise<any[] | undefined> {
        if (all) {
            return (req.patient.tokens = []);
        } else {
            req.patient.tokens = req.patient.tokens.filter((token: { token: any; }) => {
                return token.token !== req.token;
            });
        }
    };

}

export default Patient