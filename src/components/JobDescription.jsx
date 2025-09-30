import React, { useState } from "react";
import { Upload, Button, Input, message } from "antd";
import { UploadOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import mammoth from "mammoth";

export default function JobDescription({ jdText, onJDParsed }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState(jdText || "");

  const handleFileUpload = async (f) => {
    setFile(f);
    let content = "";
    try {
      if (f.type === "application/pdf") {
        const buffer = await f.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const contentObj = await page.getTextContent();
          content += contentObj.items.map(i => i.str).join(" ") + "\n";
        }
      } else if (f.type.includes("wordprocessingml") || f.name.endsWith(".docx")) {
        const buffer = await f.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        content = result.value;
      } else {
        content = await f.text();
      }
      setText(content);
      if (onJDParsed) onJDParsed(content);
      message.success("JD uploaded successfully.");
    } catch (err) {
      console.error(err);
      message.error("Failed to read file.");
    }
    return false;
  };

  const handleDelete = () => {
    setFile(null);
    setText("");
    if (onJDParsed) onJDParsed("");
  };

  return (
    <div>
      <Upload showUploadList={false} beforeUpload={handleFileUpload}>
        <Button icon={<UploadOutlined />}>Upload Job Description</Button>
      </Upload>
      {file && (
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <strong>{file.name}</strong>
          <Button icon={<EyeOutlined />} onClick={() => window.open(URL.createObjectURL(file))} />
          <Button icon={<DeleteOutlined />} danger onClick={handleDelete} />
        </div>
      )}
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Job Description appears here..."
        autoSize={{ minRows: 3, maxRows: 15 }}
        style={{ marginTop: 10 }}
      />
    </div>
  );
}
