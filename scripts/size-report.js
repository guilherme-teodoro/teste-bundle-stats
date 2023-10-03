require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const token = jwt.sign({}, process.env.PRIVATE_KEY, {
  algorithm: "RS256",
  expiresIn: "10m",
  issuer: process.env.APP_ID,
});

console.log(token);

function getAccessToken() {
  return axios.post(
    `https://api.github.com/app/installations/${process.env.INSTALLATION_ID}/access_tokens`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
}

getAccessToken().then(({ data }) => {});
