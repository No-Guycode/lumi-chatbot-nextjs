// src/app/components/AdminDashboard/Login.js
"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Set authenticated flag in sessionStorage
        sessionStorage.setItem('adminAuthenticated', 'true')
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Authentication failed')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <h1>Admin Dashboard Login</h1>
      <form onSubmit={handleLogin} className="admin-form">
        {error && <div className="admin-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="password">Admin Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-box"
            placeholder="Enter admin password"
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn admin-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

// src/app/components/AdminDashboard/Dashboard.js
"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Settings from './Settings'
import ChatLogs from './ChatLogs'
import ApiKeys from './ApiKeys'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('settings')
  const router = useRouter()
  
  useEffect(() => {
    // Check authentication on component mount
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated')
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [router])
  
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated')
    router.push('/admin')
  }
  
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Lumi Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'chatlogs' ? 'active' : ''}`}
          onClick={() => setActiveTab('chatlogs')}
        >
          Chat Logs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'apikeys' ? 'active' : ''}`}
          onClick={() => setActiveTab('apikeys')}
        >
          API Keys
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'settings' && <Settings />}
        {activeTab === 'chatlogs' && <ChatLogs />}
        {activeTab === 'apikeys' && <ApiKeys />}
      </div>
    </div>
  )
}

// src/app/components/AdminDashboard/Settings.js
"use client"

import React, { useState, useEffect } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    rateLimit: 5,
    rateLimitDuration: 60,
    maxTokens: 500
  })
  const [status, setStatus] = useState({ message: '', type: '' })
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data.settings)
        }
      } catch (error) {
        setStatus({
          message: 'Failed to load settings',
          type: 'error'
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSettings()
  }, [])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      })
      
      if (response.ok) {
        setStatus({
          message: 'Settings updated successfully',
          type: 'success'
        })
      } else {
        setStatus({
          message: 'Failed to update settings',
          type: 'error'
        })
      }
    } catch (error) {
      setStatus({
        message: 'Error saving settings',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isLoading && !settings) {
    return <div>Loading settings...</div>
  }
  
  return (
    <div className="admin-settings">
      <h2>Bot Settings</h2>
      
      {status.message && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="rateLimit">Rate Limit (requests per window)</label>
          <input
            id="rateLimit"
            type="number"
            name="rateLimit"
            value={settings.rateLimit}
            onChange={handleChange}
            min="1"
            className="input-box"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="rateLimitDuration">Rate Limit Window (seconds)</label>
          <input
            id="rateLimitDuration"
            type="number"
            name="rateLimitDuration"
            value={settings.rateLimitDuration}
            onChange={handleChange}
            min="1"
            className="input-box"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="maxTokens">Maximum Tokens</label>
          <input
            id="maxTokens"
            type="number"
            name="maxTokens"
            value={settings.maxTokens}
            onChange={handleChange}
            min="1"
            max="8000"
            className="input-box"
          />
        </div>
        
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

// src/app/components/AdminDashboard/ChatLogs.js
"use client"

import React, { useState, useEffect } from 'react'

export default function ChatLogs() {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/admin/logs')
        if (response.ok) {
          const data = await response.json()
          setLogs(data.logs)
        } else {
          setError('Failed to fetch logs')
        }
      } catch (error) {
        setError('Error loading chat logs')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchLogs()
  }, [])
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }
  
  if (isLoading) {
    return <div>Loading chat logs...</div>
  }
  
  if (error) {
    return <div className="admin-error">{error}</div>
  }
  
  return (
    <div className="admin-logs">
      <h2>Chat Logs</h2>
      
      {logs.length === 0 ? (
        <p>No chat logs available</p>
      ) : (
        <div className="logs-container">
          {logs.map((session, index) => (
            <div key={index} className="log-session">
              <div className="log-header">
                <span>Session ID: {session.sessionId}</span>
                <span>Started: {formatDate(session.timestamp)}</span>
              </div>
              <div className="messages">
                {session.messages.map((msg, msgIndex) => (
                  <div key={msgIndex} className={`message ${msg.role}`}>
                    <div className="message-header">
                      <span>{msg.role === 'user' ? 'User' : 'Lumi'}</span>
                      <span>{formatDate(msg.timestamp)}</span>
                    </div>
                    <div className="message-content">
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// src/app/components/AdminDashboard/ApiKeys.js
"use client"

import React, { useState, useEffect } from 'react'

export default function ApiKeys() {
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState({ message: '', type: '' })
  
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/admin/apikey')
        if (response.ok) {
          const data = await response.json()
          // Show partial key for security
          setApiKey(data.masked_key || '')
        }
      } catch (error) {
        setStatus({
          message: 'Failed to load API key information',
          type: 'error'
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchApiKey()
  }, [])
  
  const handleUpdateKey = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/apikey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      })
      
      if (response.ok) {
        setStatus({
          message: 'API key updated successfully',
          type: 'success'
        })
      } else {
        setStatus({
          message: 'Failed to update API key',
          type: 'error'
        })
      }
    } catch (error) {
      setStatus({
        message: 'Error updating API key',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="admin-api-keys">
      <h2>OpenAI API Key</h2>
      
      {status.message && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleUpdateKey} className="apikey-form">
        <div className="form-group">
          <label htmlFor="apiKey">API Key</label>
          <input
            id="apiKey"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="input-box"
            placeholder="sk-..."
          />
          <p className="helper-text">Current key: {apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}` : 'Not set'}</p>
        </div>
        
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update API Key'}
        </button>
      </form>
    </div>
  )
}
