import React, { useState } from 'react'
import { Input, Button, Upload, message } from 'antd'
import { UploadOutlined , CloseCircleFilled } from '@ant-design/icons'

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'heic'];

  const onFileChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (!file) return;

    // Image Extension validation
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      message.error(`Only ${allowedExtensions.join(', ')} files are allowed`);
      return;
    }

    //  Image Size validation
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 20) {
      message.error('Image must not exceed 20MB');
      return;
    }

    //  Preview(NAME/URL)
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setImageFile(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSend = () => {
    if (!text.trim() && !imageFile) {
      message.error('Please type a message or upload an image.');
      return;
    }

    onSend({
      text: text.trim(),
      image: imagePreview 
    });

    setText('');
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <div style={{ display: 'flex', gap: 8, padding: 8, borderTop: '1px solid #ddd', alignItems: 'center' }}>
      <Input.TextArea
        rows={1}
        placeholder="Type your message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={(e) => {
          if (!e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        style={{ flex: 1, resize: 'none' }}
      />
      <Upload
        accept=".png,.jpg,.jpeg,.gif,.webp,.heic"
        showUploadList={false}
        beforeUpload={() => false}
        onChange={onFileChange}
      >
        <Button icon={<UploadOutlined />} />
      </Upload>
      <Button type="primary" onClick={handleSend}>
        Send
      </Button>

      {imagePreview && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={imagePreview}
            alt="preview"
            style={{
              width: 40,
              height: 40,
              objectFit: 'cover',
              borderRadius: 6,
              border: '1px solid #ddd',
            }}
          />
          <CloseCircleFilled
            onClick={removeImage}
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              color: '#ff4d4f',
              fontSize: 18,
              cursor: 'pointer',
              background: '#fff',
              borderRadius: '50%',
            }}
          />
        </div>
      )}
    </div>
  );
}

