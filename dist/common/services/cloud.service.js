"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudService = exports.CloudService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("../../config");
const crypto_1 = require("crypto");
const exception_1 = require("../exception");
class CloudService {
    cloudClient;
    constructor() {
        this.cloudClient = new client_s3_1.S3Client({
            region: config_1.AWS_REGION,
            credentials: {
                accessKeyId: config_1.AWS_ACCESS_KEY_ID,
                secretAccessKey: config_1.AWS_ACCESS_SECRET_KEY
            }
        });
    }
    async uploadAsset({ Bucket = config_1.AWS_BUCKET_NAME, ACL = client_s3_1.ObjectCannedACL.private, file, folder = "general" }) {
        const key = `${config_1.APPLICATION_NAME}/${folder}/${(0, crypto_1.randomUUID)()}${file.originalname}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: Bucket,
            Key: key,
            ACL: ACL,
            Body: file.buffer,
        });
        await this.cloudClient.send(command);
        if (!command.input.Key) {
            throw new exception_1.BadException("Failed to upload this asset");
        }
        return command.input.Key;
    }
}
exports.CloudService = CloudService;
exports.cloudService = new CloudService();
