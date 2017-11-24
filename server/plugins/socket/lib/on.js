const chalk = require(`chalk`);

module.exports = function(event, handler) {
  const cSocket = chalk.cyan(`[ SOCKET ]`);
  const cEvent = chalk.yellow(event);

  this.on(event, data => {
    const cData = `${chalk.green(typeof data)} ${chalk.yellow(
      JSON.stringify(data)
    )}`;

    console.log(`\n\t${cSocket} ↓ received`);
    console.log(`\t${cEvent} --> ${cData}`);

    handler(data);
  });
};
