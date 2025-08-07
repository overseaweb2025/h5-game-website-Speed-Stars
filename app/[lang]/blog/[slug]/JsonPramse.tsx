import React from 'react';
interface JsonLdScriptProps {
  data: object; // 传入你的 JSON-LD 数据对象
}
export const JsonLdScript: React.FC<JsonLdScriptProps> = ({ data }) => {

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const jsonString = JSON.stringify(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );

};
