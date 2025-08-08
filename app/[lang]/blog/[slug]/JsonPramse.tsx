// components/JsonLdScript.tsx
import Script from 'next/script';
import React from 'react';

// 定义 props 类型，允许传入对象或字符串
interface JsonLdScriptProps {
  data: object | string;
}

export const JsonLdScript: React.FC<JsonLdScriptProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  let jsonString;
  try {
    // 如果传入的是对象，直接序列化。
    // 如果传入的是字符串，我们假设它已经是 JSON 字符串，直接使用。
    if (typeof data === 'object') {
      jsonString = JSON.stringify(data);
    } else {
      jsonString = data;
    }
  } catch (e) {
    console.error("Invalid JSON-LD data:", e);
    return null;
  }

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
};