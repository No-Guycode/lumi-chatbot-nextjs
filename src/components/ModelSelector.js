"use client"

import React from 'react'

export default function ModelSelector() {
  return (
    <div className="container section">
      <h2>Select AI Model</h2>
      <select id="model-select" className="input-box">
        <option value="gpt-4o">GPT-4o</option>
        <option value="gpt-4">GPT-4</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
      </select>
    </div>
  )
}
