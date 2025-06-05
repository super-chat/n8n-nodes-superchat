module.exports = {
  /**
   * https://prettier.io/docs/en/options.html#end-of-line
   */
  endOfLine: "lf",

  /**
   * https://prettier.io/docs/en/options.html#semicolons
   */
  semi: true,

  /**
   * https://prettier.io/docs/en/options.html#trailing-commas
   */
  trailingComma: "es5",

  /**
   * https://prettier.io/docs/en/options.html#quotes
   */
  singleQuote: false,

  /**
   * https://prettier.io/docs/en/options.html#bracket-spacing
   */
  bracketSpacing: true,

  /**
   * https://prettier.io/docs/en/options.html#tab-width
   */
  tabWidth: 2,

  /**
   * https://prettier.io/docs/en/options.html#tabs
   */
  useTabs: false,

  plugins: ["prettier-plugin-organize-imports"],
};
