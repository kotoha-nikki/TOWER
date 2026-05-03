import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const readme = await readFile("README.md", "utf8");
const changelog = await readFile("CHANGELOG.md", "utf8");

const version = packageJson.version;
const errors = [];

if (!readme.includes(`version: ${version}`)) {
  errors.push(`README.md does not mention version: ${version}`);
}

if (!changelog.includes(`## ${version}`) && !changelog.includes(`## [${version}]`)) {
  errors.push(`CHANGELOG.md does not contain an entry for ${version}.`);
}

if (!readme.includes("public/banner.png")) {
  errors.push("README.md does not reference public/banner.png.");
}

if (errors.length) {
  console.error("Release check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Release check OK for v${version}.`);
