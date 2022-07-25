import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
    secure: true
});

class CloudinaryService {

    constructor(){}

    public async uploadfile(file: any): Promise<UploadApiResponse>{
        try{
            const result = cloudinary.uploader.upload(file);
            return result;
        }
        catch (err) {
            throw new Error(err)
        }
    }

    public async deletefile(file_id): Promise<UploadApiResponse>{
        try{
            const result = cloudinary.uploader.destroy(file_id);
            return result;
        }
        catch (err) {
            throw new Error(err)
        }
    }

    public async updatefile(file_id, file): Promise<UploadApiResponse>{
        try{
            const result = cloudinary.uploader.destroy(file_id);
            if(result) {
                return cloudinary.uploader.upload(file);
            }
        }
        catch (err) {
            throw new Error(err);
        }
    }

}

export default CloudinaryService;