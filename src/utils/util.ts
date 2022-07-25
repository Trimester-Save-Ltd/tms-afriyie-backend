


/**
 * @description - a class to house all small utility functions that are not worth staying on their own!
 */
class UtilSever {

    constructor() { }

    /**
     * @description - Calculating a Due Date
        A typical pregnancy lasts, on average, 280 days, or 40 weeks—starting with the first day of the 
        last normal menstrual period as day 1. An estimated due date can be calculated by 
        following steps 1 through 3:
        
        First, determine the first day of your last menstrual period.
        Next, count back 3 calendar months from that date.
        Lastly, add 1 year and 7 days to that date.

     * @param first_day_of_last_circle - first day of last circle
     * @returns - due date for delivery
     */
    public async calculateGestation(first_day_of_last_circle: Date): Promise<Date> {
        try {
            const first_day = new Date(first_day_of_last_circle);
            const last_month = new Date(first_day.setMonth(first_day.getMonth() - 3));
            const last_month_plus_one_year = new Date(last_month.setFullYear(last_month.getFullYear() + 1));
            const last_month_plus_one_year_plus_seven_days = new Date(last_month_plus_one_year.setDate(last_month_plus_one_year.getDate() + 7));
            return last_month_plus_one_year_plus_seven_days;
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }

    /**
     * @description - calculating the amount of days left for a patient to deliver
     * @param due_date - medically calculated for delivery
     * @returns - amount of days left to reach due date
     */
    public async calculateDueDays(due_date: Date): Promise<number> {
        try {
            const today = new Date();
            const diff = Math.round(today.getTime() - due_date.getTime());
            const due_days = Math.abs(diff / (1000 * 3600 * 24));
            return Number(due_days.toFixed(0));
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }


    /**
     * @description - generate random code for patient to reset password
     * @param length - length of the generated code
     * @returns 
     */
    public generateToken(length: number): number {
            var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
            if (length > max) {
                return this.generateToken(max) + this.generateToken(length - max);
            }
            max = Math.pow(10, length + add);
            var min = max / 10; // Math.pow(10, n) basically
            var number = Math.floor(Math.random() * (max - min + 1)) + min;
            return Number(("" + number).substring(add));
    }
}

export default UtilSever;