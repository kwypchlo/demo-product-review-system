const path = require("path");

const eslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(__dirname, f)).join(" --file ")}`;
const tscCommand = () => "tsc --noEmit";

module.exports = {
  "*.{js,jsx}": [eslintCommand, "prettier --write"],
  "*.{ts,tsx}": [eslintCommand, tscCommand, "prettier --write"],
  "*": "prettier --write --ignore-unknown",
};
