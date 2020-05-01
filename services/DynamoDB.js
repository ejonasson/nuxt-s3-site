import AWS from 'aws-sdk'
import moment from 'moment'
import { orderBy } from 'lodash'
import exifr from 'exifr'

export default class DynamoDB {
    constructor() {
        this.reauthorize(process.env.AMAZON_ACCESS_KEY_ID, process.env.AMAZON_SECRET_ACCESS_KEY)
        this.client = new AWS.DynamoDB()
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

    saveFileData(file) {
        exifr.parse(file).then((output) => {
            const timestamp = moment(output.CreateDate) || moment.unix(Math.floor(file.lastModified / 1000))
            this.storeMetadata({
                imageId: file.name,
                timestamp: timestamp.unix()
            })
        })
    }

    storeMetadata(data) {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: {
                "imageId": {
                    S: data.imageId
                },
                "timestamp": {
                    N: data.timestamp.toString()
                }
            }
        }
        this.client.putItem(params, function (err, data) {
            if (err) console.log(err, err.stack);
        });
    }
}
