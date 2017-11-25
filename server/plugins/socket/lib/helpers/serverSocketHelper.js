module.exports = bindParams => ({
  emit: require('./methods/emit').bind(bindParams),
  on: require('./methods/on').bind(bindParams),
  to: require('./methods/to').bind(bindParams),
});
