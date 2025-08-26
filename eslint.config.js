import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
    },
    rules: {},
  },
  {
    files: [
      "**/__tests__/**/*.{ts,tsx}",
      "**/*.test.{ts,tsx}",
      "src/test/**/*.{ts,tsx}",
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        describe: true,
        it: true,
        expect: true,
        vi: true,
        beforeEach: true,
        afterEach: true,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-refresh/only-export-components": "off",
    },
  },
]);
