import { useState, useMemo, useCallback } from "react";
import { Button, Input, List, Typography, Modal, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useChatroomsStore } from "../store/chatRoomStore";
import { useAuthStore } from "../store/authStore";
import { useDebounce } from "../hooks/useDebounce";
import '../styles/main.css'; 

const { Title, Text } = Typography;

export default function DashboardPage() {
  const chatrooms = useChatroomsStore((state) => state.chatrooms);
  const addChatroom = useChatroomsStore((state) => state.addChatroom);
  const deleteChatroom = useChatroomsStore((state) => state.deleteChatroom);
  const logout = useAuthStore((state) => state.logout);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newChatroomTitle, setNewChatroomTitle] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 300);
  const navigate = useNavigate();

  const filteredChatrooms = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return chatrooms.filter((c) => c.title.toLowerCase().includes(q));
  }, [chatrooms, debouncedSearch]);

  const showAddModal = useCallback(() => {
    setNewChatroomTitle("");
    setIsModalVisible(true);
  }, []);

  const handleAddChatroom = useCallback(() => {
    if (!newChatroomTitle.trim()) {
      message.error("Chatroom title cannot be empty");
      return;
    }
    addChatroom(newChatroomTitle.trim());
    setIsModalVisible(false);
    message.success("Chatroom created");
  }, [addChatroom, newChatroomTitle]);

  const confirmDeleteChatroom = useCallback(
    (id) => {
      Modal.confirm({
        title: "Delete chatroom?",
        content: "Are you sure you want to delete this chatroom?",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk() {
          deleteChatroom(id);
          message.success("Chatroom deleted");
        },
      });
    },
    [deleteChatroom]
  );

  return (
    <div className="dashboard" role="main">
      <Space className="dashboard-header">
        <Title level={3}>Your Chatrooms</Title>
        <Button onClick={logout} danger aria-label="Logout">
          Logout
        </Button>
      </Space>

      <Input.Search
        className="chatrooms-search"
        placeholder="Search chatrooms"
        allowClear
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search chatrooms"
      />

      <List
        itemLayout="horizontal"
        dataSource={filteredChatrooms}
        locale={{ emptyText: "No chatrooms available" }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="delete"
                danger
                onClick={() => confirmDeleteChatroom(item.id)}
                aria-label={`Delete chatroom ${item.title}`}
              >
                Delete
              </Button>,
              <Button
                key="open"
                type="primary"
                onClick={() => navigate(`/chat/${item.id}`)}
                aria-label={`Open chatroom ${item.title}`}
              >
                Open
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={
                <>
                  <Text type="secondary">
                    {item.lastMessage || "No messages yet"}
                  </Text>
                  <br />
                  <Text type="secondary" className="chatroom-meta-time">
                    {new Date(item.updatedAt).toLocaleString()}
                  </Text>
                </>
              }
            />
          </List.Item>
        )}
      />

      <Button
        type="dashed"
        onClick={showAddModal}
        className="create-chatroom-btn"
        aria-label="Create new chatroom"
      >
        + Create New Chatroom
      </Button>

      <Modal
        title="Create Chatroom"
        open={isModalVisible}
        onOk={handleAddChatroom}
        onCancel={() => setIsModalVisible(false)}
        okButtonProps={{ "aria-label": "Confirm create chatroom" }}
        cancelButtonProps={{ "aria-label": "Cancel create chatroom" }}
      >
        <Input
          placeholder="Chatroom title"
          value={newChatroomTitle}
          onChange={(e) => setNewChatroomTitle(e.target.value)}
          aria-label="Chatroom title input"
          onPressEnter={handleAddChatroom}
        />
      </Modal>
    </div>
  );
}
