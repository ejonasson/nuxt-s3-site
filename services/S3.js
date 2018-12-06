import AWS from 'aws-sdk';
import moment from 'moment';
import { orderBy } from 'lodash';

export default class S3 {
    constructor() {
        AWS.config = new AWS.Config();
        AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        AWS.config.region = "us-east-1";
        this.client = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: 'ejonasson-baby-photos' }
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
                    return { publicUrl: this.getPublicUrl(item), ...item }
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
}
