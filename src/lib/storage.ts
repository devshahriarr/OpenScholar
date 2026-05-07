import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * [DEPRECATED] S3/MinIO Implementation
 * The user requested to switch to local storage because of ECONNREFUSED issues with MinIO.
 */
/*
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.S3_SECRET_KEY || "minioadmin",
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "openscholar";
*/

const UPLOAD_BASE_PATH = path.join(process.cwd(), "public", "uploads");

/**
 * Uploads a file buffer to the local filesystem and returns the public path.
 */
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  paperId: string,
  versionNumber: number
): Promise<string> {
  try {
    const extension = fileName.split(".").pop() || "pdf";
    const uniqueId = uuidv4().substring(0, 8);
    
    // Relative directory for public access
    const relativeDir = path.join("papers", paperId);
    // Absolute directory for file system operations
    const absoluteDir = path.join(UPLOAD_BASE_PATH, relativeDir);
    
    // Create directory if it doesn't exist
    await mkdir(absoluteDir, { recursive: true });

    const fileNameWithVersion = `v${versionNumber}_${uniqueId}.${extension}`;
    const absoluteFilePath = path.join(absoluteDir, fileNameWithVersion);
    const publicPath = `/uploads/papers/${paperId}/${fileNameWithVersion}`;

    // Write file to local disk
    await writeFile(absoluteFilePath, fileBuffer);

    return publicPath;
  } catch (error) {
    console.error("[LOCAL_STORAGE_UPLOAD_ERROR]", error);
    throw new Error("Failed to upload file to local storage.");
  }
}

/**
 * Returns the public URL for a file.
 * Since we are using local storage in the public folder, the path is the URL.
 */
export async function getFileUrl(pathOrKey: string): Promise<string> {
  // If it starts with http, it might be an old S3 URL or external link
  if (pathOrKey.startsWith("http")) {
    return pathOrKey;
  }
  
  // If it's a relative path starting with /uploads, return as is
  if (pathOrKey.startsWith("/uploads")) {
    return pathOrKey;
  }

  // Fallback / legacy support for S3 keys that didn't have /uploads prefix
  return `/uploads/${pathOrKey.replace(/^papers\//, "papers/")}`;
}
