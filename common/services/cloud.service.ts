import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET_KEY, AWS_REGION,AWS_BUCKET_NAME, APPLICATION_NAME} from "../../config";
import { randomUUID } from "crypto";
import { BadException } from "../exception";
export class CloudService {
    private cloudClient: S3Client;
 constructor() {
        this.cloudClient = new S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_ACCESS_SECRET_KEY
            }
        });
    }
    async uploadAsset({ Bucket=AWS_BUCKET_NAME,ACL=ObjectCannedACL.private, file,folder="general" }: { file: Express.Multer.File, folder?: string,Bucket?: string,ACL?: ObjectCannedACL }): Promise<string> {
        const key = `${APPLICATION_NAME}/${folder}/${randomUUID()}${file.originalname}`;
  const command = new PutObjectCommand({
    Bucket: Bucket,
    Key: key,
    ACL: ACL, 
    Body: file.buffer,
  });
  await this.cloudClient.send(command);
  if(!command.input.Key){throw new BadException("Failed to upload this asset")}
    return command.input.Key;
}}
export const cloudService = new CloudService();