const chalk = require(`chalk`);

module.exports = function(message, data) {
  const cSocket = chalk.cyan(`[ SOCKET ]`);
  const cMessage = chalk.yellow(message);
  const cData = `${chalk.green(typeof data)} ${chalk.yellow(
    JSON.stringify(data)
  )}`;

  console.log(`\n\t${cSocket} ↑ broadcasted`);
  console.log(`\t${cMessage} --> ${cData}`);

  this.broadcast.emit(message, data);
};
