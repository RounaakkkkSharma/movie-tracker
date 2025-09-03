// app/api/watched/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, movieId, title, poster, rating } = await req.json();
    if (!userId || !movieId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const watchedItem = await prisma.watched.create({
      data: {
        userId,
        movieId,
        title,
        poster,
        rating: rating ? Number(rating) : null,
      },
    });

    return NextResponse.json(watchedItem);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json([], { status: 400 });

    const items = await prisma.watched.findMany({
      where: { userId: Number(userId) },
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, movieId } = await req.json();
    if (!userId || !movieId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    await prisma.watched.deleteMany({
      where: {
        userId: Number(userId),
        movieId: Number(movieId),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
