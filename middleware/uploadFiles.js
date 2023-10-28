require('dotenv').config();
const fs = require("fs");
const AWS = require("aws-sdk");


exports.uploadFiles = (req, res, next) => {
    try {
      if (req.files && req.files.length > 0) {
        const files = req.files?.map((file) => {
          return { ...file };
        });
  
        const fileUrls = [];
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          Bucket: process.env.AWS_BUCKET_NAME,
        });
  
        files.forEach((item) => {
          let extension = item.originalname.split(".");
          let contentType = "";
  
          // Determine the content type based on the file extension
          switch (extension[extension.length - 1].toLowerCase()) {
            case "pdf":
              contentType = "application/pdf";
              break;
            case "epub":
              contentType = "application/epub+zip";
              break;
            case "mp3":
              contentType = "audio/mpeg";
              break;
            case "txt":
              contentType = "text/plain"; // Set the content type for text files
              break;  
            // Add more cases for other file types if needed
            default:
              contentType = "application/octet-stream"; // Default content type
          }
  
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            ContentType: contentType,
            Key:
              Date.now().toString() +
              Math.random() * 10000 +
              `.${extension[extension.length - 1]}`,
            Body: item.buffer,
          };
  
          s3.upload(params, function (err, data) {
            if (!err) {
              fileUrls.push(data.Location);
              if (fileUrls.length === files.length) {
                req.awsFiles = fileUrls; // Store file URLs in the request object
                next();
              }
            } else {
              const error = new Error(err);
              error.statusCode = 500;
              throw error;
            }
          });
        });
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  