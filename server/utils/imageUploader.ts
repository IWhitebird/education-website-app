import cloudinary from "cloudinary";


export async function UploadToCloudinary(
  file: any,
  folder: any,
  height?: any,
  quality?: any,
) {
  const options: cloudinary.UploadApiOptions = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }

  options.resource_type = "auto";

  return await cloudinary.v2.uploader.upload(file.tempFilePath, options);
}
