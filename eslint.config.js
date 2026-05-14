import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["worker-configuration.d.ts", ".wrangler/**", "dist/**", "coverage/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        AbortController: "readonly",
        AbortSignal: "readonly",
        ArrayBuffer: "readonly",
        ExecutionContext: "readonly",
        ExportedHandler: "readonly",
        Headers: "readonly",
        KVNamespace: "readonly",
        KVNamespacePutOptions: "readonly",
        MessageBatch: "readonly",
        Queue: "readonly",
        R2Bucket: "readonly",
        R2Object: "readonly",
        R2ObjectBody: "readonly",
        R2PutOptions: "readonly",
        Request: "readonly",
        RequestInfo: "readonly",
        RequestInit: "readonly",
        Response: "readonly",
        ResponseInit: "readonly",
        ScheduledController: "readonly",
        TextEncoder: "readonly",
        URL: "readonly",
        URLPattern: "readonly",
        caches: "readonly",
        clearTimeout: "readonly",
        console: "readonly",
        crypto: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["scripts/**/*.mjs", "eslint.config.js"],
    languageOptions: {
      globals: {
        URL: "readonly",
        console: "readonly",
        fetch: "readonly",
        process: "readonly",
      },
    },
  },
);
