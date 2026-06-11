import prisma from "@/lib/prisma";
import { ApiResponse } from "@/lib/types/schema";
import { slugValidation } from "@/lib/validations/shorten";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const parsedBody = slugValidation.safeParse({ slug });

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        data: null,
        message: "Invalid data type",
        success: false,
        error: {
          message: parsedBody.error.issues[0].message,
          status: 400,
        },
      } satisfies ApiResponse<null>,
      { status: 400 },
    );
  }

  try {
    const link = await prisma.link.findUnique({
      where: {
        slug,
      },
    });

    if (!link) {
      return NextResponse.json(
        {
          data: null,
          message: "URL not found",
          success: false,
          error: {
            message: "URL not found",
            status: 404,
          },
        } satisfies ApiResponse<null>,
        {
          status: 404,
        },
      );
    }

    return NextResponse.redirect(link.url);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpecred error: ", error);
    }

    return NextResponse.json(
      {
        data: null,
        message: "Internal Server Error",
        success: false,
        error: {
          message: "Internal Server Error",
          status: 500,
        },
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
