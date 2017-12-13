export default (value, start1, stop1, start2, stop2) =>
  start2 + ((stop2 - start2) * ((value - start1) / (stop1 - start1)));
