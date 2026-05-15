import { loadEnv } from "vite";

const mode = process.argv[2];
const allowedModes = new Set(["dev", "sit", "uat", "prod"]);

if (!mode || !allowedModes.has(mode)) {
  console.error(
    `Expected one build mode: ${Array.from(allowedModes).join(", ")}.`,
  );
  process.exit(1);
}

const env = {
  ...loadEnv(mode, process.cwd(), ""),
  ...process.env,
};

const requiredKeys = [
  "VITE_APP_ENV",
  "VITE_API_BASE_URL",
  "VITE_GOOGLE_CLIENT_ID",
  "VITE_PRODUCT_PLATFORM",
];

const missingKeys = requiredKeys.filter((key) => !env[key]?.trim());

if (missingKeys.length > 0) {
  console.error(
    `Missing required ${mode} environment variable(s): ${missingKeys.join(", ")}`,
  );
  console.error(
    `Set them in .env.${mode} for local builds or in the matching Netlify context.`,
  );
  process.exit(1);
}

try {
  new URL(env.VITE_API_BASE_URL);
} catch {
  console.error(`VITE_API_BASE_URL is not a valid URL for ${mode}.`);
  process.exit(1);
}

if (!env.VITE_GOOGLE_CLIENT_ID.endsWith(".apps.googleusercontent.com")) {
  console.error(
    `VITE_GOOGLE_CLIENT_ID does not look like a Google OAuth client id for ${mode}.`,
  );
  process.exit(1);
}

console.log(`Environment validated for ${mode}.`);
