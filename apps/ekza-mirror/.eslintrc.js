module.exports = {
  extends: ["../../packages/config/eslint/nextjs.js", "next/core-web-vitals"],
  parserOptions: {
    project: "./tsconfig.json",
  },
};
