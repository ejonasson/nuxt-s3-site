import AWS from 'aws-sdk';
import moment from 'moment';
import { orderBy } from 'lodash';

export default class S3 {
    constructor() {
        AWS.config = new AWS.Config();
        AWS.config.accessKeyId = process.env.AMAZON_ACCESS_KEY_ID;
        AWS.config.secretAccessKey = process.env.AMAZON_SECRET_ACCESS_KEY;
        AWS.config.region = "us-east-1";
        this.thumbnailClient = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: process.env.AMAZON_BUCKET_NAME + '-thumbnails' }
        })
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

                // Add the Public Url
                let images = data.Contents.map((item) => {
                    return { thumbnailUrl: this.getThumbnailUrl(item), publicUrl: this.getPublicUrl(item), ...item }
                })

                // Sort by Last Modified Date
                let sortedImages = orderBy(images, (image) => {
                    return moment(image.LastModified).valueOf()
                }, 'desc')

                resolve(sortedImages)
            })
        })
    }

    getPublicUrl(item) {
        return this.client.getSignedUrl('getObject', { Key: item.Key })
    }

    getThumbnailUrl(item) {
        return this.thumbnailClient.getSignedUrl('getObject', { Key: item.Key })
    }
}
