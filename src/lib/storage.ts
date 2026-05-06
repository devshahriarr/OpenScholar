import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
  forcePathStyle: true, // Required for MinIO
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.S3_SECRET_KEY || "minioadmin",
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "openscholar";

/**
 * Uploads a file buffer to S3/MinIO and returns the object key.
 */
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  paperId: string,
  versionNumber: number
): Promise<string> {
  const extension = fileName.split(".").pop();
  const uniqueId = uuidv4().substring(0, 8);
  const objectKey = `papers/${paperId}/v${versionNumber}_${uniqueId}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return objectKey;
}

/**
 * Generates a pre-signed URL for downloading or viewing a file.
 * The URL expires in 1 hour.
 */
export async function getFileUrl(objectKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
