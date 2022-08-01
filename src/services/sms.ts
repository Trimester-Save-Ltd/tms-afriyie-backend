import { Twilio } from "twilio";
import { PhoneNumberInstance } from "twilio/lib/rest/lookups/v1/phoneNumber";
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';

// twilio account keys
const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const verifyservice = process.env.TWILIO_VERIFY_SERVICE as string;
const client = new Twilio(accountSid, authToken);

class TwilioService {

    constructor() { }

    /**
     * @description - send generate a token and send to the user to verify the user, using twilio verify service
     * @param {string} verifier - phone number to send the verification code to
     * @param {string} channel - medium twilio should use to send the token
     * @returns {object} - object containing status and infomation of the request
     */
    public async twiliogenerateandsendtoken(verifier: string, channel: string = "sms"): Promise<VerificationInstance> {
        const verificationobject = await client.verify.services(verifyservice).verifications.create({
            to: verifier,
            channel: channel
        })
        return verificationobject;
    }


    /**
     * @description - verify the user using the token provided by the user
     * @param {string} verifier - phone number who received the token
     * @param {string} token - verification code sent to the user phone
     * @returns {object} - object containing status and infomation of the request
     */
    public async twilioverifytoken(verifier: string, token: string): Promise<VerificationCheckInstance> {
        try{
            const verificationobject = await client.verify.services(verifyservice).verificationChecks.create({
                to: verifier,
                code: token
            })
            return verificationobject;
        }
        catch (error) {
            throw new Error((error.status));
        }
    }

    // TODO create a generic email sending method
    // TODO create a phone number validation method

    public async validatephone(phone: string): Promise<PhoneNumberInstance> {
        const verificationobject = await client.lookups.phoneNumbers(phone).fetch();
        return verificationobject;
    }

    public async sendSMS(phone: string, message: string): Promise<any> {
        const verificationobject = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE as string, //INFO u only need one of the from and messagesid
            messagingServiceSid: process.env.TWILIO_MESSAGE_SID as string,
            to: phone
        });
        return verificationobject;
    }
}


export default TwilioService;

