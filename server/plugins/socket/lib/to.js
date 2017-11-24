const chalk = require(`chalk`);

module.exports = function(id, message, data) {
  const cSocket = chalk.cyan(`[ SOCKET ]`);
  const cId = chalk.cyan(`[ ${id} ]`);
  const cMessage = chalk.yellow(message);
  const cData = `${chalk.green(typeof data)} ${chalk.yellow(
    JSON.stringify(data)
  )}`;

  console.log(`\n\t${cSocket} ↑ emitted to ${cId}`);
  console.log(`\t${cMessage} --> ${cData}`);

  this.to(id).emit(message, data);
};
