const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const { validationError } = require("../utils/response/errors");

const storage = multer.memoryStorage();

const filter = function (req, file, cb) {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "video/mp4",
    "application/pdf",
    "application/vnd.ms-powerpoint",
  ];

  // Check if the file type is allowed
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Reject file with an error message
    cb(
      validationError({
        message:
          "Invalid file type. Only JPEG, JPG, PNG, MP4, PDF, and PPT files are allowed.",
      }),
      false
    );
  }
};

const upload = multer({ storage: storage, fileFilter: filter });

exports.uploadSingle = (fieldname) => upload.single(fieldname);

exports.uploadMix = (arrayOfFields) => upload.fields(arrayOfFields);

exports.uploadToCloudinary = async (fileBuffer, filename, folder = "") => {
  return await new Promise((resolve) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: filename,
          folder: folder,
          resource_type: "auto",
        },
        (err, uploadResult) => {
          return resolve(uploadResult);
        }
      )
      .end(fileBuffer);
  });
};
