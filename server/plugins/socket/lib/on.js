const chalk = require(`chalk`);

module.exports = (socket, listener, handler) => {
  socket.on(listener, data => {
    console.log(`\n\t${chalk.cyan(`[ SOCKET ]`)} ↓ received message`);
    console.log(`\t${chalk.yellow(listener)} --> ${chalk.yellow(JSON.stringify(data))}`);

    handler(data);
  });
};
