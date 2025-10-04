import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["**/.next/**", "**/node_modules/**", "**/dist/**", "**/__trash/**"],
  },
  // Existing Next.js and Prettier compatibility
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),

  // Override the rule to disable it
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "error",
    },
  },
];

export default eslintConfig;