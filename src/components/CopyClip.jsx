import React, { useState } from 'react'
import { Tooltip, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default function CopyToClipboardWrapper({ text, children }) {
  const [visible, setVisible] = useState(false)

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        message.success('Copied to clipboard!')
        setVisible(false)
      }}
    >
      <Tooltip
        title="Click to copy"
        open={visible}
        onOpenChange={setVisible}
        mouseLeaveDelay={0.1}
      >
        <span tabIndex={0} style={{ cursor: 'pointer' }}>
          {children}
        </span>
      </Tooltip>
    </CopyToClipboard>
  )
}
