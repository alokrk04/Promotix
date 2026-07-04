const js = require("@eslint/js");

module.exports = [
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      semi: ["warn", "always"],
      quotes: ["warn", "single", { avoidEscape: true }],
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Buffer: "readonly",
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        URL: "readonly",
        AbortController: "readonly",
        Response: "readonly",
        Request: "readonly",
        Headers: "readonly",
      },
    },
  },
  {
    ignores: ["node_modules/**", "frontend/**", "backend/**", "certs/**", "dist/**"],
  },
];
