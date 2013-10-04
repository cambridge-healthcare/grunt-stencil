module.exports = function trim (string) {
  return string.replace(/(^\s+)|(\s+$)/g, "");
}
