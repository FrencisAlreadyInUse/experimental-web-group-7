const chalk = require(`chalk`);

module.exports = (socket, message, data) => {
  console.log(`\n\t${chalk.cyan(`[ SOCKET ]`)} ↑ emitted message`);
  console.log(`\t${chalk.yellow(message)} --> ${chalk.yellow(JSON.stringify(data))}`);

  socket.emit(message, data);
};
