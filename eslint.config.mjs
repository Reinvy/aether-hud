// Minimal ESLint config — avoids eslint-config-next compat circular ref issue
export default [
  {
    ignores: [".next/**", "node_modules/**", "dist/**"],
  },
];
