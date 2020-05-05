import AWS from 'aws-sdk';
import moment from 'moment';
import { orderBy } from 'lodash';
import exifr from 'exifr'

export default class S3 {
    constructor() {
        this.reauthorize(process.env.AMAZON_ACCESS_KEY_ID, process.env.AMAZON_SECRET_ACCESS_KEY)
        this.client = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: process.env.AMAZON_BUCKET_NAME }
        })
    }

    reauthorize(key, secret) {
        AWS.config = new AWS.Config();
        AWS.config.accessKeyId = key;
        AWS.config.secretAccessKey = secret;
        AWS.config.region = "us-east-1";

        this.client = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: process.env.AMAZON_BUCKET_NAME }
        })
    }

    fetchImages() {
        return new Promise((resolve, reject) => {
            this.client.listObjects((err, data) => {
                if (err) {
                    console.error(err)
                    reject(err)
                }

                // Add the Thumbnail Url
                let imagePromises = data.Contents.map(async (item) => {
                    return this.client.getObject({ Key: item.Key })
                        .promise().then(async (data) => {
                            const fileData = await exifr.parse(data.Body)
                            const timestamp = fileData && fileData.CreateDate ? moment(fileData.CreateDate)
                                : moment(item.LastModified)
                            return {
                                thumbnailUrl: this.getThumbnailUrl(item),
                                id: item.ETag.split('"').join(''), // This tag has quotes around it for some reason, so ditch those
                                timestamp: timestamp.unix(),
                                ...item,
                                ...fileData
                            }
                        })
                })

                // Sort by Last Modified Date
                Promise.all(imagePromises).then((images) => {
                    resolve(orderBy(images, (image) => image.timestamp, 'desc'))
                })
            })
        })
    }

    getPublicUrl(item) {
        return `https://${process.env.AMAZON_BUCKET_NAME}.s3.amazonaws.com/${item.Key}`
    }

    getThumbnailUrl(item) {
        return `https://${process.env.AMAZON_BUCKET_NAME + '-thumbnails'}.s3.amazonaws.com/${item.Key}`
    }

    upload(file, callback) {
        const params = {Bucket: process.env.AMAZON_BUCKET_NAME, Key: file.name, Body: file, ACL: 'public-read'}
        this.client.putObject(params, (err, data) => {
            if (err) {
                console.error(err)
            }
            callback(data)
        })
    }
}
