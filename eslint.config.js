import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  eslintPluginPrettier,
  eslintConfigPrettier,
  {
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto", // LF/CRLF 문제 해결
          tabWidth: 2, // Prettier 설정과 일치
        },
      ],
    },
  },
];
