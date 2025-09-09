function encodeWithDashSpaceReversible(str: string) {
  const withEscapedHyphen = str.replace(/-/g, "~h~");  // 先把原始连字符转义
  const withDash = withEscapedHyphen.trim().replace(/\s+/g, "-"); // 空白 -> -
  return encodeURIComponent(withDash);
}

function decodeWithDashSpaceReversible(str: string) {
  try {
    const decoded = decodeURIComponent(str);
    return decoded
      .replace(/-/g, " ")       // 先把 - 还原为空格
      .replace(/~h~/g, "-");    // 再把占位符还原成连字符
  } catch {
    return str;
  }
}

export {
  encodeWithDashSpaceReversible,
  decodeWithDashSpaceReversible
}
