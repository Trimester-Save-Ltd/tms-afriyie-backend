import multer from 'multer';


/**
 * @description - file uploads engine middleware with multer
 */
class MulterUtil {

    constructor() { }

    storage = multer.diskStorage({})
    fileFilter = (req, file, cb) => {
        if (file.originalname) { // TODO - check if there are otherway to check if the file is valid
            cb(null, true);
        } else {
            cb('invalid image file', false);
        }
    }
    /**
     * @description - method to upload file using multer
     * @param storage - storage description/engine, where file will be stored
     * @param fileFilter - function to check if the file is valid or some other operation
     * @returns - multer instance
     */
    public uploads(storage = this.storage, fileFilter = this.fileFilter): any {
        return multer({ storage, fileFilter });
    }
}


export default MulterUtil;
