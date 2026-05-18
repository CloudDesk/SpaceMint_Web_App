import { spawnSync } from "node:child_process";

const allowedModes = new Set(["dev", "sit", "uat", "prod"]);
const branchModeAliases = new Map([
  ["dev", "dev"],
  ["dev_v1", "dev"],
  ["dev_v2", "dev"],
  ["sit", "sit"],
  ["uat", "uat"],
  ["prod", "prod"],
  ["production", "prod"],
  ["main", "prod"],
  ["master", "prod"],
]);

const normalize = (value) => value?.trim().toLowerCase();
const requestedMode = normalize(process.env.VITE_APP_ENV);
const branchMode = branchModeAliases.get(normalize(process.env.BRANCH));
const mode = allowedModes.has(requestedMode) ? requestedMode : branchMode;

if (!mode) {
  console.error(
    "Unable to resolve Netlify build mode. Set VITE_APP_ENV to dev, sit, uat, or prod.",
  );
  process.exit(1);
}

console.log(`Netlify build mode resolved: ${mode}`);

const result = spawnSync("npm", ["run", `build:${mode}`], {
  env: {
    ...process.env,
    VITE_APP_ENV: process.env.VITE_APP_ENV ?? mode,
  },
  shell: process.platform === "win32",
  stdio: "inherit",
});

process.exit(result.status ?? 1);
