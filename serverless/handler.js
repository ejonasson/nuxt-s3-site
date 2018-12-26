'use strict';
// dependencies
const async = require('async');
const AWS = require('aws-sdk');
const gm = require('gm')
            .subClass({ imageMagick: true }); // Enable ImageMagick integration.
// constants
const MAX_WIDTH  = 250;
const MAX_HEIGHT = 250;
const SRC_BUCKET = 'ejonasson-baby-photos'
const DEST_BUCKET = 'ejonasson-baby-photos-thumbnails'

const s3 = new AWS.S3();

module.exports.resize = (event, context, callback) => {
  let srcKey  = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "))

    // Infer the image type.
    var typeMatch = srcKey.match(/\.([^.]*)$/)
    if (!typeMatch) {
        callback("Could not determine the image type.")
        return;
    }
    var imageType = typeMatch[1]
    if (imageType !== "jpg" && imageType !== "jpeg" && imageType !== "png") {
        callback(`Unsupported image type: ${imageType}`)
        return;
    }

 // Download the image from S3, transform, and upload to a different S3 bucket.
    async.waterfall([
        function download(next) {
            // Download the image from S3 into a buffer.
            s3.getObject(
                {
                    Bucket: SRC_BUCKET,
                    Key: srcKey
                },
                next
            );
        },
        function transform(response, next) {
            gm(response.Body).size(function(err, size) {
                // Infer the scaling factor to avoid stretching the image unnaturally.
                var scalingFactor = Math.min(
                    MAX_WIDTH / size.width,
                    MAX_HEIGHT / size.height
                );
                var width  = scalingFactor * size.width
                var height = scalingFactor * size.height

                // Transform the image buffer in memory.
                this.resize(width, height)
                    .toBuffer(imageType, function(err, buffer) {
                        if (err) {
                            next(err)
                        } else {
                            next(null, response.ContentType, buffer)
                        }
                    });
            });
        },
        function upload(contentType, data, next) {
            // Stream the transformed image to a different S3 bucket.
            s3.putObject({
                    Bucket: DEST_BUCKET,
                    Key: srcKey,
                    Body: data,
                    ContentType: contentType
                },
                next)
            }
        ], function (err) {
            if (err) {
                console.error(
                    'Unable to resize ' + SRC_BUCKET + '/' + srcKey +
                    ' and upload to ' + DEST_BUCKET + '/' + srcKey +
                    ' due to an error: ' + err
                )
            } else {
                console.log(
                    'Successfully resized ' + SRC_BUCKET + '/' + srcKey +
                    ' and uploaded to ' + DEST_BUCKET + '/' + srcKey
                )
            }

            callback(null, "message")
        }
    );

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  callback(null, { message: 'Done!', event });
};
