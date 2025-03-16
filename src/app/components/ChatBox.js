"use client"

import React, { useState, useRef, useEffect } from 'react'

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatBoxRef = useRef(null)
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (input.trim() === '') return
    
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    const modelSelect = document.getElementById('model-select')
    const selectedModel = modelSelect ? modelSelect.value : 'gpt-4o'
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'An error occurred')
      }
      
      const data = await response.json()
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `Error: ${error.message || 'Failed to fetch response.'}` 
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.role === 'user' ? 'You' : 'Lumi'}:</strong> {msg.content}
          </p>
        ))}
        {isLoading && <p><em>Lumi is thinking...</em></p>}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="input-box"
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button 
        className="btn" 
        onClick={sendMessage}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </>
  )
}
