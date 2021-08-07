var express = require('express');
var router = express.Router();
var Busboy = require("busboy");
const authenticate = require("../authenticate");
const Image = require("../models/images");

var http = require('http'),
    inspect = require('util').inspect,
    path = require('path'),
    os = require('os'),
    fs = require('fs');


router.route('/')
    .post(authenticate.verifyUser, (req, res, next) => {
        var busboy = new Busboy({headers: req.headers});
        var name = "";

        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            if(fieldname === "name") {
                name = val;
            }
            console.log('Field [' + fieldname + ']: value: ' + inspect(val));
          });

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
            var saveTo = path.join("", path.basename(fieldname));
            file.pipe(fs.createWriteStream(saveTo));
            file.on('data', function(data) {
              console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
            });
            file.on('end', function() {
                console.log("Field: ", fieldname);
                console.log("Name: ", name);
                if(fieldname === "img" && name !== "") {
                    console.log("Creating Image");
                    //The "file" object does not upload successfully, and may not actually contain the file
                    Image.create({
                        name: name,
                        img: fs.createWriteStream(saveTo),
                        owner: req.user._id
                    })
                    .then(image => {
                        console.log("Image Uploaded: ", image)
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(image);
                    })
                }
              console.log('File [' + fieldname + '] Finished');
            });
          });
          
          //On successful upload, shoud exit before reaching this
          // busboy.on('finish', function() {
          //   console.log('Reached Finish');
          //   res.writeHead(303, { Connection: 'close', Location: '/' });
          //   res.end();
          // });

          req.pipe(busboy);

    });

module.exports = router;