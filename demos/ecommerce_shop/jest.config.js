// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  moduleNameMapper: {
      "@src/(.*)": "<rootDir>/$1",
      "\\.(css|less|scss|sss|styl)$":
          "<rootDir>/node_modules/jest-css-modules",
  },
  roots: ["<rootDir>"],
  testPathIgnorePatterns: ["/node_modules/", "stories.tsx"],
  transform: {
      "\\.tsx?$": "ts-jest",
  },
};
