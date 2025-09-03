import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, movieId, title, poster } = await req.json();
  if (!userId || !movieId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const item = await prisma.watchlist.create({
    data: { userId, movieId, title, poster },
  });

  return NextResponse.json(item);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json([], { status: 400 });

  const items = await prisma.watchlist.findMany({
    where: { userId: Number(userId) },
  });

  return NextResponse.json(items);
}

export async function DELETE(req: Request) {
  const { userId, movieId } = await req.json();
  await prisma.watchlist.deleteMany({
    where: { userId: Number(userId), movieId: Number(movieId) },
  });
  return NextResponse.json({ success: true });
}
