import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "dist/**", "e2e/**", ".cron/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
);
