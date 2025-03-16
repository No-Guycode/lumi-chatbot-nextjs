"use client"

import React, { useState, useEffect } from 'react'

export default function DateTime() {
  const [dateTime, setDateTime] = useState("Loading date & time...")

  useEffect(() => {
    const updateDateTime = () => {
      try {
        const now = new Date()
        const formattedDateTime = now.toLocaleString() // Formats based on the user's locale
        setDateTime(formattedDateTime)
      } catch (error) {
        console.error("Error updating date & time:", error)
        setDateTime("Error loading time.")
      }
    }

    // Update immediately and then every second
    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    
    // Cleanup on unmount
    return () => clearInterval(interval)
  }, [])

  return <div className="date-time" id="date-time">{dateTime}</div>
}
