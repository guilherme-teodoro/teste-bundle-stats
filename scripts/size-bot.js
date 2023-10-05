const { createAppAuth } = require("@octokit/auth-app");
const { Octokit } = require("octokit");
const fs = require("fs");

const owner = process.env.CIRCLE_PR_USERNAME;
const repo = process.env.CIRCLE_PR_REPONAME;
const pull_number = process.env.CIRCLE_PR_NUMBER;
const commitSha1 = process.env.CIRCLE_SHA1;

async function upsertReview(body) {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.MFE_SIZE_BOT_APP_ID,
      privateKey: process.env.MFE_SIZE_BOT_PRIVATE_KEY,
      installationId: process.env.MFE_SIZE_BOT_INSTALLATION_ID,
    },
  });

  await octokit.rest.apps.getAuthenticated();

  const { data: reviews } = await octokit.rest.pulls.listReviews({
    owner,
    repo,
    pull_number,
  });

  const review = reviews
    .reverse()
    .find(({ user }) => user.login === "danger-test[bot]");

  if (review) {
    return octokit.rest.pulls.updateReview({
      owner,
      repo,
      pull_number,
      review_id: review.id,
      body,
    });
  } else {
    return octokit.rest.pulls.createReview({
      owner,
      repo,
      pull_number,
      body,
    });
  }
}

async function main() {
  const data = JSON.parse(fs.readFileSync("./build/bundle-stats.json", "utf8"));
  const { text } = data.insights.webpack.assetsSizeTotal.data;
  const summary = data.summary;
  const table = summary.webpack.map(
    ({ label, displayValue, displayDelta, displayDeltaPercentage }) => {
      return `| ${label} | ${displayDelta} | ${displayDeltaPercentage} | ${displayValue} |`;
    },
  );

  const body = `
# MFE Size Bot
## ${text}

| Label | Diff | % | New value |
| --- | --- | --- | --- |
${table.join("\n")}

Commit: ${commitSha1}
`;

  await upsertReview(body);
}

main();
