import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import rateLimiter from '../../../utils/rateLimit'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request) {
  try {
    // Apply rate limiting
    const { isRateLimited, headers } = await rateLimiter(request)
    
    // Check if rate limit has been exceeded
    if (isRateLimited) {
      return NextResponse.json(
        { message: 'Rate limit exceeded. Please wait a moment and try again.' },
        { status: 429, headers }
      )
    }
    
    // Parse request body
    const body = await request.json()
    const { messages, model = 'gpt-3.5-turbo' } = body
    
    // Validate the request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { response: 'Please enter a message.' },
        { status: 400, headers }
      )
    }
    
    // Format messages for OpenAI API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model, 
      messages: formattedMessages,
    })
    
    // Extract the response
    const response = completion.choices[0].message.content
    
    // Return the response with rate limit headers
    return NextResponse.json({ response }, { headers })
  } catch (error) {
    console.error('API error:', error)
    
    // Return appropriate error message
    return NextResponse.json(
      { 
        response: `Error: ${error.message || 'An unexpected error occurred'}` 
      },
      { status: 500 }
    )
  }
}
