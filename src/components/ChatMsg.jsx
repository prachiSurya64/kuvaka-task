import React from "react";
import { Typography, Image } from "antd";
import CopyToClipboardWrapper from "./CopyClip";

const { Text, Paragraph } = Typography;
export default function ChatMsg({ message, isUser, darkMode }) {

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        padding: "4px 8px",
        marginTop: 10,
      }}
      aria-label={`${isUser ? "You" : "Gemini"} message at ${formatTime(
        message.createdAt
      )}`}
    >
      <CopyToClipboardWrapper text={message.text || ""}>
        <div
          style={{
            maxWidth: "80%",
            backgroundColor: isUser ? "#1890ff" : "#f0f0f0",
            color: isUser ? "white" : darkMode ? "#003d5c" : "black",
            borderRadius: 8,
            padding: 10,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
          tabIndex={0}
        >
          {message.image && (
            <Image
              src={message.image}
              alt="uploaded"
              style={{ maxWidth: "100%", marginBottom: 8, borderRadius: 6 }}
              preview={{ mask: null }}
            />
          )}
          {message.text && (
            <Paragraph style={{ margin: 0 }}>{message.text}</Paragraph>
          )}
          <Text
            type="secondary"
            style={{
              fontSize: 10,
              display: "block",
              textAlign: "right",
              marginTop: 4,
              color: isUser ? "rgba(255,255,255,0.7)" : "#888",
            }}
            aria-hidden="true"
          >
            {formatTime(message.createdAt)}
          </Text>
        </div>
      </CopyToClipboardWrapper>
    </div>
  );
}
