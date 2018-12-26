import AWS from 'aws-sdk';
import moment from 'moment';
import { orderBy } from 'lodash';

export default class S3 {
    constructor() {
        this.reauthorize(process.env.AMAZON_ACCESS_KEY_ID, process.env.AMAZON_SECRET_ACCESS_KEY)
        this.thumbnailClient = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: process.env.AMAZON_BUCKET_NAME + '-thumbnails' }
        })
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
                let images = data.Contents.map((item) => {
                    return { thumbnailUrl: this.getThumbnailUrl(item), ...item }
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

    upload(file) {
        const params = {Bucket: process.env.AMAZON_BUCKET_NAME, Key: file.name, Body: file, ACL: 'public-read'}
        this.client.putObject(params, (err, data) => {
            console.log(err, data);
        })
    }
}
