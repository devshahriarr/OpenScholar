import { NextResponse } from "next/server";
import { extractTokenFromHeader } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";
import { createPaperDraft, getOrCreateCategory } from "@/modules/paper/repository";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    // 1. Authenticate User
    const authHeader = req.headers.get("Authorization");
    // Fallback to cookie if Authorization header is missing
    let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (!token) {
      const cookieHeader = req.headers.get("Cookie") || "";
      const match = cookieHeader.match(/auth_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { verifyToken } = await import("@/lib/auth");
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const abstract = formData.get("abstract") as string;
    const categoryName = formData.get("category") as string;
    const keywordsStr = formData.get("keywords") as string;

    if (!file) return NextResponse.json({ message: "File is required" }, { status: 400 });
    if (!title) return NextResponse.json({ message: "Title is required" }, { status: 400 });
    if (!abstract) return NextResponse.json({ message: "Abstract is required" }, { status: 400 });
    if (!categoryName) return NextResponse.json({ message: "Category is required" }, { status: 400 });

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ message: "File exceeds 50MB limit" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ message: "Only PDF files are allowed" }, { status: 400 });
    }

    const keywords = keywordsStr ? keywordsStr.split(",").map((k) => k.trim()).filter(Boolean) : [];

    // 3. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Temporary Paper ID for Storage Path (since Prisma assigns UUID on create)
    const tempPaperId = uuidv4();

    // 5. Upload File to Local Storage
    const pdfUrl = await uploadFile(
      buffer,
      file.name,
      file.type,
      tempPaperId,
      1
    );

    // 6. Get or Create Category
    const categoryId = await getOrCreateCategory(categoryName);

    // 7. Save to Database
    const paper = await createPaperDraft({
      title,
      abstract,
      keywords,
      pdfUrl: pdfUrl, // Storing the local public path (e.g., /uploads/papers/...)
      categoryId,
      userId: user.sub,
    });

    // Note: If we really wanted to use Prisma's generated ID for the folder path, 
    // we would create an empty Draft first, upload file, and then Update the draft with the URL.
    // For simplicity, the temp UUID handles collision-free storage just fine.

    return NextResponse.json(
      { message: "Paper submitted successfully", paperId: paper.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[PAPER_UPLOAD_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error", error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
