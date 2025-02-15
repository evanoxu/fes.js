{
  "name": "fes-plugin-{{{name}}}",
  "version": "2.0.0",
  "description": "一个fes.js插件",
  "main": "lib/index.js",
  "files": [
    "lib",
    "README.md"
  ],
  "scripts": {
    "dev": "node scripts/build.js --watch",
    "build": "node scripts/build.js",
    "lint": "eslint -c ./.eslintrc.js --ext .js,.jsx,.vue,.ts"
  },
  "license": "MIT",
  "keywords": [
  ],
  "dependencies": {
  },
  "devDependencies": {
    "@babel/core": "^7.15.0",
    "@babel/preset-env": "^7.15.0",
    "@webank/eslint-config-webank": "0.3.1",
    "chalk": "^4.1.2",
    "chokidar": "^3.5.2",
    "deepmerge": "^4.2.2",
    "fs-extra": "^10.0.0",
    "husky": "^4.3.0",
    "lint-staged": "^10.4.0",
    "yargs-parser": "^20.2.9"
  },
  "peerDependencies": {
    "@fesjs/fes": "^2.0.0",
    "vue": "^3.2.37"
  },
  "lint-staged": {
    "*.{js,jsx,vue,ts}": [
      "eslint --format=codeframe"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}