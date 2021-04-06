// filename: uploadImage.js

"use strict";

const serverless = require('serverless-http');
const express = require('express')
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
const Jimp = require("jimp");

const app = express()
const s3 = new AWS.S3();
const width = 200;
const height = 200;
const imageType = "image/png";
const bucket = process.env.Bucket;


app.get('/health', function (req, res) {
    res.status(200).send(JSON.stringify({
        message: 'Hello World!'
    }))
  })


app.post('/upload', function (req, res) {
    let requestBody = JSON.parse(req.body);
    let photoUrl = requestBody.photoUrl;
    let objectId = uuidv4();
    let objectKey = `resize-${width}x${height}-${objectId}.png`;
    
    fetchImage(photoUrl)
        .then(image => image.resize(width, height)
            .getBufferAsync(imageType))
        .then(resizedBuffer => uploadToS3(resizedBuffer, objectKey))
        .then(function(response) {
            console.log(
                {"logValue": `Image ${objectKey} was uploaed and resized`}
            );
            
            res.status(200).send(response);
        })
        .catch(error => console.log({logValue: error}));

})
  
/**
* @param {*} data
* @param {string} key
*/
function uploadToS3(data, key) {
    return s3
        .putObject({
            Bucket: bucket,
            Key: key,
            Body: data,
            ContentType: imageType
        })
        .promise();
}

/**
* @param {url}
* @returns {Promise}
*/
function fetchImage(url) {
    return Jimp.read(url);
}

module.exports.handler = serverless(app);