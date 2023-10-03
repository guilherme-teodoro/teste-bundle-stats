const { createAppAuth } = require("@octokit/auth-app");
const { Octokit, App } = require("octokit");

require("dotenv").config();

// CIRCLE_PR_NUMBER

async function main() {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.APP_ID,
      privateKey: process.env.PRIVATE_KEY,
      installationId: process.env.INSTALLATION_ID,
    },
  });

  // authenticates as app based on request URLs
  await octokit.rest.apps.getAuthenticated();

  // creates an installation access token as needed
  // assumes that installationId 123 belongs to @octocat, otherwise the request will fail
  await octokit.request(
    "PUT /repos/guilherme-teodoro/teste-bundle-stats/pulls/2/reviews/1651441012",
    {
      body: "Great stuff! 2",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
}

main();
