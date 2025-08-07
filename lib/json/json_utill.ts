/**
 * Unescapes a JSON string that contains escaped HTML.
 * @param {string} jsonString The raw, escaped JSON string.
 * @returns {object} An object with unescaped string values.
 */
export function unescapeStructuredData(jsonString: string) {
  // First, parse the main JSON string to get the object
  const data = JSON.parse(jsonString);

  console.log('data:',data.blog)
  return data;
}