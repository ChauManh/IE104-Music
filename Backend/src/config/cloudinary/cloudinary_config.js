const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (file, type = 'playlist') => {
  try {
    const uploadOptions = {
      use_filename: true,
      unique_filename: true,
      resource_type: 'auto',
      folder: type === 'avatar' ? 'avatars' : 'playlist-thumbnails',
      transformation: type === 'avatar' ? [
        { width: 500, height: 500, crop: "fill" }
      ] : []
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadImage
};