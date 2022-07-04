import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'
dotenv.config();
import config from 'config'


const cloudName = config.get<string>("cloudName")
const apiKey = config.get<string>("apiKey")
const apiSecret = config.get<string>("apiSecret")

// CLOUDINARY CONFIG
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
});

// IMAGE CLOUD STORAGE
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary, // CREDENTIALS,
    params: <Options['params']>{
        folder: "BeatStudio",
        resource_type: "auto",
    },
});

const uploader = multer({
    storage: cloudinaryStorage,
    limits: {
        fileSize: 100000000 // 10000000 Bytes = 100 MB
    },
    fileFilter(req, file, cb) {
        // upload only mp4 and mkv format
        if (!file.originalname.match(/\.(jpeg|png|gif|heic|jpg|mp4|MPEG-4|mkv)$/)) {
            return cb(new Error('Accepted file types: jpeg, png, gif, heic, jpg, mp4, MPEG-4, mkv'))
        }
        cb(null, true)
    }
})

export default uploader