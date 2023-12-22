import { NextResponse } from "next/server";
import { createCompletion } from "./openai_api";

export async function POST(request: Request) {
  const { prompt, system } = await request.json();

  const text = await createCompletion(prompt, system);

  return new NextResponse(JSON.stringify({ text }));
}