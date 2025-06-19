import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "Unsplash API key is not configured" },
      { status: 500 }
    );
  }

  const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}&per_page=15`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    const photos = data.results.map((img: any) => ({
        src: img.urls.regular,
        width: img.width,
        height: img.height,
    }));

    return NextResponse.json({ photos });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data from Unsplash" },
      { status: 500 }
    );
  }
} 