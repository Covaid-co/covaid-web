const express = require('express');
const imageRouter = express.Router();
const mongoose = require('mongoose');
const auth = require("./auth");
const ProfilePicture = require('../models/profile-picture.model');
const ObjectId = mongoose.Types.ObjectId

module.exports = (upload) => {
    let dev_db_url =
    "mongodb+srv://debanik:Corona2020@coronacluster-9wiub.mongodb.net/RequestRedesignDB?retryWrites=true&w=majority";
    let mongoDB = process.env.MONGODB_URI || dev_db_url;
    const connect = mongoose.createConnection(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

    let gfs;

    connect.once('open', () => {
        // initialize stream
        gfs = new mongoose.mongo.GridFSBucket(connect.db, {
            bucketName: "uploads"
        });
    });

    /*
        POST: Upload a single image to Image collection
    */
    imageRouter.route('/')
        .post(upload.single('file'), auth.required, (req, res, next) => {
            // check for existing images
            ProfilePicture.findOne({ user_id: req.token.id })
                .then((image) => {
                    if (image) {
                        gfs.delete(new ObjectId(image.fileId), function (err) {
                            if (err) console.log(err)
                            else console.log('success in deletion');
                        });
                        ProfilePicture.update({ user_id: req.token.id },
                            {
                                $set: {
                                    filename: req.file.filename,
                                    fileId: req.file.id,
                                }
                            },
                            function (err, result) {
                            if (err) return res.send(err);
                            return res.send(result);
                            }
                        );
                    } else {
                        let newImage = new ProfilePicture({
                            user_id: req.token.id,
                            filename: req.file.filename,
                            fileId: req.file.id,
                        });
    
                        newImage.save()
                            .then((image) => {
                                res.status(200).json({
                                    success: true,
                                    image,
                                });
                            })
                            .catch(err => {
                                res.status(500).json(err)
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err)
                });
        })

    // /*
    //     GET: Delete an image from the collection
    // */
    // imageRouter.route('/delete/:id')
    //     .get((req, res, next) => {
    //         Image.findOne({ _id: req.params.id })
    //             .then((image) => {
    //                 if (image) {
    //                     Image.deleteOne({ _id: req.params.id })
    //                         .then(() => {
    //                             return res.status(200).json({
    //                                 success: true,
    //                                 message: `File with ID: ${req.params.id} deleted`,
    //                             });
    //                         })
    //                         .catch(err => { return res.status(500).json(err) });
    //                 } else {
    //                     res.status(200).json({
    //                         success: false,
    //                         message: `File with ID: ${req.params.id} not found`,
    //                     });
    //                 }
    //             })
    //             .catch(err => res.status(500).json(err));
    //     });

    //     GET: Fetches a particular image and render on browser
    // */
    imageRouter.route('/:userID')
        .get((req, res, next) => {
            ProfilePicture.findOne({ user_id: req.params.userID })
            .then((image) => {
                gfs.find({ filename: image.filename }).toArray((err, files) => {
                    if (!files[0] || files.length === 0) {
                        res.status(200).json({
                            success: false,
                            message: 'No files available',
                        });
                    }
    
                    if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
                        // render image to browser
                        gfs.openDownloadStreamByName(image.filename).pipe(res);
                    } else {
                        res.status(404).json({
                            err: 'Not an image',
                        });
                    }
                });
            })
            .catch(err => { 
                res.status(500).json(err) 
            });
        });

    return imageRouter;
};