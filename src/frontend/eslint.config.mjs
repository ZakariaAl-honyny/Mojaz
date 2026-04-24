// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

const eslintConfig = defineConfig([
  {
    // Ignore story files from Next.js build linting
    ignores: ["**/*.stories.ts", "**/*.stories.tsx", "**/*.stories.js", "**/*.stories.jsx"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // Storybook rules scoped ONLY to story files
  ...storybook.configs["flat/recommended"].map((config: any) => ({
    ...config,
    files: ["**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)", "**/.storybook/**"],
  })),
]);

export default eslintConfig;
