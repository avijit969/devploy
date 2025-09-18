import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { accessToken } = await auth.api.getAccessToken({
      body: {
        providerId: "github",
        userId: session.session.userId,
      },
    });

    if (!accessToken) {
      return NextResponse.json(
        { error: "No GitHub access token found" },
        { status: 400 }
      );
    }
    const url = new URL(req.url);
    const page = url.searchParams.get("page") || "1";
    const per_page = url.searchParams.get("per_page") || "10";
    const response = await fetch(
      `https://api.github.com/user/repos?sort=updated&direction=desc&per_page=${per_page}&page=${page}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json(
        { error: "GitHub API error", details: err },
        { status: response.status }
      );
    }

    const repos = await response.json();

    const linkHeader = response.headers.get("link");
    let hasNextPage = false;
    if (linkHeader && linkHeader.includes('rel="next"')) {
      hasNextPage = true;
    }

    return NextResponse.json(
      {
        repos,
        pagination: {
          page: Number(page),
          per_page: Number(per_page),
          hasNextPage,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
