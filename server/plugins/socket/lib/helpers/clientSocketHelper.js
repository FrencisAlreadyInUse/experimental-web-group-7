module.exports = bindParams => ({
  air: require('./methods/air').bind(bindParams),
});
