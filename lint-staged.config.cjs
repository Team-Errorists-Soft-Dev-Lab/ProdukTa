// lint-staged.config.cjs
module.exports = {
  "**/*.{js,jsx,ts,tsx,json,md,mdx,css,html,yml,yaml,scss,sass}": (
    filenames,
  ) => {
    const escapedFileNames = filenames
      .map((filename) => `"${filename}"`)
      .join(" ");
    return [
      `prettier --ignore-path='.gitignore' --write ${escapedFileNames}`,
      `git add ${escapedFileNames}`,
    ];
  },
};
