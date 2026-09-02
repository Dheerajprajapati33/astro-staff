export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.expo/**",
      "**/dist/**",
      "**/android/**",
      "**/ios/**",
      "**/.claude/**",
      "**/.vscode/**",
    ],
  },
  {
    plugins: {
      "react-hooks": {
        rules: {
          "exhaustive-deps": {
            meta: { type: "suggestion" },
            create: () => ({}),
          },
        },
      },
    },
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        alert: "readonly",
        React: "readonly",
        navigator: "readonly",
        globalThis: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-dupe-keys": "error",
      "no-duplicate-imports": "error",
      "no-redeclare": "error",
      "no-unreachable": "error",
      "no-constant-condition": "warn",
    },
  },
];

