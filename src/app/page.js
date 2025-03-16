"use client"

import React, { useState } from 'react'
import ChatBox from './components/ChatBox'
import ModelSelector from './components/ModelSelector'
import DateTime from './components/DateTime'

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle('dark-mode')
  }

  return (
    <main className={darkMode ? 'dark-mode' : ''}>
      <header>Welcome to Lumi - Your AI Chatbot</header>
      <DateTime />
      
      <div className="container">
        <h1>Lumi - Your AI Chatbot</h1>
        <ChatBox />
      </div>
      
      <ModelSelector />
      
      <div className="container section">
        <h2>How Lumi Works</h2>
        <p>Lumi is powered by OpenAI's GPT-4, allowing it to process and generate human-like text responses. When you type a message, it sends the input to OpenAI's servers, where a deep learning model analyzes your query and provides a relevant response.</p>
      </div>
      
      <div className="container section">
        <h2>Developers</h2>
        <p>Ahmed Bin Nabeel</p>
        <p>Muhammad Rayyan</p>
      </div>
      
      <footer>&copy; 2025 Lumi Chatbot Team. All rights reserved.</footer>
      
      <button className="toggle-btn" onClick={toggleDarkMode}>
        {darkMode ? '☀️' : '🌙'}
      </button>
    </main>
  )
}
