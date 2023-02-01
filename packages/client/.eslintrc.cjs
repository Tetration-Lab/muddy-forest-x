module.exports = {
  settings: {
    react: {
      // Tells eslint-plugin-react to automatically detect the version of React to use.
      version: 'detect',
    }
  },
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint",'prettier',"react", "react-hooks"],
  "extends": [
    'prettier',
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off" // for react 17.0.0
  }
}
