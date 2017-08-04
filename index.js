const fs = require('fs');
const loaderUtils = require('loader-utils');
const coffeelint = require('coffeelint').lint;
const chalk = require('chalk');

module.exports = function(source) {
  this.cacheable && this.cacheable();

  let appDirectory = fs.realpathSync(process.cwd());
  let sourceFileName = loaderUtils.getRemainingRequest(this)
        .replace(`${appDirectory}/`, '');

  let path = './coffeelint.json';
  let file = fs.readFileSync(path, 'utf8');
  let config = JSON.parse(file);

  this.addDependency(path);

  let errs = coffeelint(source, config);

  errs.forEach((e) => {
    let message = `${e.message} @ ${sourceFileName}:${e.lineNumber}`;
    this.emitError(chalk.yellow(`CoffeeLint error: ${message}`));
  });

  if (errs.length && process.env.NODE_ENV === 'production') {
    throw new Error(chalk.red('CoffeeLint failed on style errors.'));
  }

  return source;
};
