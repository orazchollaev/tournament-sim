import tseslint from "typescript-eslint"
import vue from "eslint-plugin-vue"
import vueParser from "vue-eslint-parser"

export default tseslint.config({
  files: ["**/*.{ts,vue}"],

  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },

  rules: {
    "no-undef": "off",

    // Vue
    "vue/multi-word-component-names": "off",
    "vue/no-multiple-template-root": "off",
    "vue/require-default-prop": "off",
    "vue/no-v-html": "warn",

    // prettier ile cakisabilir
    "vue/html-self-closing": "off",
    "vue/padding-line-between-blocks": "off",

    // TS
    "@typescript-eslint/consistent-type-imports": "off",

    // General
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error",
  },
})
