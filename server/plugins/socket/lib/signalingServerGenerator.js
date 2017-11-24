module.exports = socket => ({
  emit: require(`./emit`).bind(socket),
  to: require(`./to`).bind(socket),
  air: require(`./air`).bind(socket),
  on: require(`./on`).bind(socket)
});
