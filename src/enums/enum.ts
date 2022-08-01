export enum vital_type {
    BLOOD_PRESSURE = 'BP',
    GLUCOSE_LEVEL = 'GL',
    WEIGHT = 'WE',
    GESTATION = 'GE'
}

export enum budget_type {
    MEDICAL = 'ME',
    FOOD = 'FO',
    PERSONAL = 'PE',
    TRAVEL = 'TR',
    OTHER = 'OT'
}

export enum notification_type {
    APPOINTMENT = 'APPOINTMENT',
    GESTATION = 'GESTATION',
    VITAL = 'VITAL'
}

export enum error_type {
    ER_BAD_NULL_ERROR = 'Field cannot be null',
    ER_DUP_ENTRY = 'Duplicate entry %s for key %s',
    ER_EMPTY_QUERY = 'Query was empty',
    ER_ALTER_INFO = 'Records %id Duplicate entry %s for key %s',
    ER_UNKNOWN_ERROR = 'Unknown error occured'

}
