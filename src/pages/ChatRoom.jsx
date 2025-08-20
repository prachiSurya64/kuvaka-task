import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Space,
  Spin,
  List,
  message as antdMessage,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useChatroomsStore } from "../store/chatRoomStore";
import { useMessagesStore } from "../store/msgStore";
import ChatInput from "../components/ChatInput";
import ChatMsg from "../components/ChatMsg";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAuthStore } from "../store/authStore";
import "../styles/chatRoom.css";

const { Title, Text } = Typography;
const PAGE_SIZE = 20;

function generateOlderMessages(count, startId) {
  return Array.from({ length: count }, (_, i) => ({
    id: `old-${startId - i}`,
    text: `Older message #${startId - i}`,
    sender: i % 2 === 0 ? "ai" : "user",
    createdAt: new Date(Date.now() - (startId - i) * 60000).toISOString(),
  }));
}

export default function ChatroomPage() {
  const { chatroomId } = useParams();
  const darkMode = useAuthStore((s) => s.darkMode);
  const navigate = useNavigate();

  const chatrooms = useChatroomsStore((s) => s.chatrooms);
  const updateLastMessage = useChatroomsStore(
    (s) => s.updateChatroomLastMessage
  );

  const messagesByChatroomId = useMessagesStore((s) => s.messagesByChatroomId);
  const addMessage = useMessagesStore((s) => s.addMessage);
  const prependMessages = useMessagesStore((s) => s.prependMessages);

  const genAI = useMemo(
    () => new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY),
    []
  );

  const [loadingOlder, setLoadingOlder] = useState(false);
  const [page, setPage] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef();
  const aiResponseTimeout = useRef(null);

  const messages = messagesByChatroomId[chatroomId] || [];
  const chatroom = useMemo(
    () => chatrooms.find((c) => c.id === chatroomId),
    [chatrooms, chatroomId]
  );

  useEffect(() => {
    if (!chatroom) {
      navigate("/dashboard");
    }
  }, [chatroom, navigate]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const loadOlderMessages = useCallback(() => {
    if (loadingOlder) return;
    setLoadingOlder(true);
    setTimeout(() => {
      const oldestMessageId = messages.length
        ? parseInt(messages[0].id.split("-")[1] || 1000)
        : 1000;
      const olderMessages = generateOlderMessages(
        PAGE_SIZE,
        oldestMessageId + PAGE_SIZE
      );
      prependMessages(chatroomId, olderMessages);
      setPage((p) => p + 1);
      setLoadingOlder(false);
    }, 1000);
  }, [loadingOlder, messages, prependMessages, chatroomId]);

 
  const getGeminiReply = useCallback(
    async (prompt) => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        console.error("Gemini API error:", error);
        return "Sorry, I couldn’t process that.";
      }
    },
    [genAI]
  );

  const simulateAIReply = useCallback(
    async (userText) => {
      if (aiResponseTimeout.current) return;
      setIsTyping(true);
      aiResponseTimeout.current = true;
      try {
        const reply = await getGeminiReply(userText);
        addMessage(chatroomId, {
          id: `ai-${Date.now()}`,
          text: reply,
          sender: "ai",
          createdAt: new Date().toISOString(),
        });
        updateLastMessage(chatroomId, reply);
      } finally {
        setIsTyping(false);
        aiResponseTimeout.current = null;
      }
    },
    [getGeminiReply, addMessage, updateLastMessage, chatroomId]
  );

  const handleSendMessage = useCallback(
    ({ text, image }) => {
      const id = `user-${Date.now()}`;
      addMessage(chatroomId, {
        id,
        text,
        image,
        sender: "user",
        createdAt: new Date().toISOString(),
      });
      updateLastMessage(chatroomId, text || "[Image]");
      simulateAIReply(text);
    },
    [addMessage, chatroomId, updateLastMessage, simulateAIReply]
  );

  const onScroll = (e) => {
    if (e.target.scrollTop < 50 && !loadingOlder) {
      loadOlderMessages();
    }
  };

  return (
    <div
      className={`chatroom ${darkMode ? "chatroom--dark" : ""}`}
      role="main"
      aria-label="Chatroom page"
    >
      <header className="chatroom_header">
        <Space className="chatroom_header-inner" align="center">
          <Button
            icon={<LeftOutlined />}
            onClick={() => navigate("/dashboard")}
            aria-label="Back to dashboard"
          />
          <h1 className="sr-only">{chatroom?.title || "Chatroom"}</h1>

          <Title level={4} className="chatroom_title">
            {chatroom?.title || "Chatroom"}
          </Title>

          <div style={{ width: 32 }} />
        </Space>
      </header>

      <main
        ref={containerRef}
        className="chatroom_messages"
        onScroll={onScroll}
        aria-live="polite"
        aria-relevant="additions"
      >
        {loadingOlder && (
          <div className="chatroom_loading" aria-hidden>
            <Spin />
          </div>
        )}

        {messages.length === 0 && (
          <Text type="secondary" className="chatroom_empty">
            No messages yet
          </Text>
        )}

        <div className="chatroom_list">
          {messages.map((m) => (
            <ChatMsg
              key={m.id}
              message={m}
              isUser={m.sender === "user"}
              darkMode={darkMode}
            />
          ))}
        </div>

        {isTyping && (
          <Text type="secondary" className="chatroom_typing">
            Gemini is typing...
          </Text>
        )}
      </main>

      <footer className="chatroom_input-area">
        <ChatInput onSend={handleSendMessage} />
      </footer>
    </div>
  );
}
