import { error_type } from "../enums/enum";
import { DatabaseError } from 'pg-protocol';
import { ValidationError } from 'class-validator';
import { EntityNotFoundError, QueryFailedError } from "typeorm";

export type ErrorType = {
    message: string | error_type
    resolution?: string | undefined;
}

export const isTypeOrmQueryFailedError = (
    err: unknown,
): err is QueryFailedError & DatabaseError => err instanceof QueryFailedError;

export const isQueryFailedError = (err: unknown): err is QueryFailedError & DatabaseError =>
    err instanceof QueryFailedError;

export function throwTypeOrmQueryFailedErrorMessage(error: NodeJS.ErrnoException) {
    if (error instanceof QueryFailedError) {
        switch (error.driverError['code']) {
            case '23502':
                return `${error.driverError['column']} can not be null`;
            case '23505':
                return 'already exists'
            //return `${error.driverError['detail'].replace(/ *\([^)=]*\) */g, "") }`;
            default:
                return 'Unknown error occured while processing your request1';
        }
    }
    return 'Unknown server error occured please try again';
}


export function throwTypeOrmEntityNotFoundErrorMessage(error: NodeJS.ErrnoException) {
    if (error instanceof EntityNotFoundError) {
        switch (error.message.includes('Could not find any entity of type')) {
            default:
                return 'the value passed cant not be associated with any patient';
        }
    }
    return 'Unknown server error occured please try again';
}

export function throwTypeOrmEntityFieldError(error: ValidationError) {
    if (error[0] instanceof ValidationError) {
        switch (error[0].property) {
            case 'first_name':
                return 'Please enter your first name';
            case 'last_name':
                return 'Please enter your last name'
            case 'password':
                return 'password must be more than 8 characters'
            default:
                return 'unknow error while trying to process data';
        }
    }
    return 'Unknown server error occured please try again';
}


export function throwTwilioAndGenericErrorMessage(error: NodeJS.ErrnoException) {
    if (error) {
        switch (parseInt(error['code']) || error['message']) {
            case 60200:
                return 'phone number format or phone number is invalid';
            case 'Error: 404':
                return 'token expired, invalid code or phone or already approved/used';
            case 'Error: 400':
                return 'provide a valid code and phone number';
            case 'Error':
                return 'provide a valid code and phone number';
            default:
                return 'Unknown error occured while processing your request';
        }
    }
    return 'Unknown server error occured please try again';
}


