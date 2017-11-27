module.exports = bindParams => ({
  air: require('./methods/air').bind(bindParams),
  on: require('./methods/on').bind(bindParams),
});
