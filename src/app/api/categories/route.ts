import { NextResponse } from "next/server";
import { getAllCategories } from "@/modules/paper/repository";

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("[GET_CATEGORIES]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
