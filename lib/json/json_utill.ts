
export function unescapeStructuredData(jsonString: string) {
  // First, parse the main JSON string to get the object
  const data = JSON.parse(jsonString);

  console.log('data:',data.blog)
  return data;
}