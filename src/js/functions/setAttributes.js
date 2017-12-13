export default ($node, attributes) => {
  // eslint-disable-next-line guard-for-in
  for (const item in attributes) {
    $node.setAttribute(item, attributes[item]);
  }
};
