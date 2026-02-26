import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = process.env.GITHUB_TOKEN;
  const username = "batuhd";

  if (!token) {
    return NextResponse.json(
      { error: "GitHub token is missing in .env" },
      { status: 500 }
    );
  }

  const query = `
    query($userName:String!) { 
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { userName: username },
      }),
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error("Failed to fetch GitHub data");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
