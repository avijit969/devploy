"use server";
export async function registerGithubWebhook({
  accessToken,
  owner,
  repo,
  webhookUrl,
  secret,
}: {
  accessToken: string;
  owner: string;
  repo: string;
  webhookUrl: string;
  secret: string;
}) {
  console.log("Registering webhook with params:", {
    accessToken,
    owner,
    repo,
    webhookUrl,
    secret,
  });
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/hooks`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${accessToken}`,
        "Content-Type": "application/json",
        "User-Agent": "your-app-name",
      },
      body: JSON.stringify({
        name: "web",
        active: true,
        events: ["push"], // also: "pull_request", "create", "delete"
        config: {
          url: webhookUrl,
          content_type: "json",
          insecure_ssl: "0",
          secret,
        },
      }),
    }
  );
  console.log("Webhook registration response status:", response.status);

  console.log(
    "Webhook registration response body:",
    await response.clone().text()
  );
  if (!response.ok) {
    const error = await response.text();
    console.error("Webhook creation failed:", error);
    throw new Error("Failed to create webhook");
  }

  return await response.json();
}
