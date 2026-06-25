import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: String(process.env.CLOUD_NAME) as string,
  api_key: String(process.env.API_KEY) as string,
  api_secret: String(process.env.API_SECRET) as string,
});
export default cloudinary;
