import { Prisma } from "@/app/generated/prisma/client";
import { toBase62 } from "@/lib/lib";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/lib/types/schema";
import { linkValidation } from "@/lib/validations/shorten";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const parsedBody = linkValidation.safeParse(body);

  if (!parsedBody.success) {
    const response: ApiResponse<null> = {
      data: null,
      message: "Invalid data format",
      success: false,
      error: {
        message: parsedBody.error.issues[0].message,
        status: 400,
      },
    };
    return NextResponse.json(response, { status: 400 });
  }

  const { url } = parsedBody.data;

  try {
    const existing = await prisma.link.findFirst({
      where: {
        url,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          data: { slug: existing.slug },
          message: "URL already shortened",
          success: true,
        } satisfies ApiResponse<{ slug: string }>,
        {
          status: 200,
        },
      );
    }

    const link = await prisma.$transaction(async (tx) => {
      //Creating temp slug
      const created = await tx.link.create({
        data: {
          slug: crypto.randomUUID(),
          url,
        },
      });

      const slug = toBase62(created.id);

      return await tx.link.update({
        where: {
          id: created.id,
        },
        data: {
          slug,
        },
      });
    });

    const response: ApiResponse<{ slug: string }> = {
      data: { slug: link.slug },
      message: "URL shortened",
      success: true,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            data: null,
            message: "Slug already exists",
            success: false,
            error: {
              status: 409,
              message: "Slug conflict",
            },
          } satisfies ApiResponse<null>,
          { status: 409 },
        );
      }
    }

    if (error instanceof Error) {
      console.error("Unexpected Error", error.message);
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
