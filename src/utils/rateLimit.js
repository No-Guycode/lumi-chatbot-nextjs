import { LRUCache } from 'lru-cache'

// Define options for the rate limiter
const rateLimit = {
  // Number of requests allowed within duration window
  tokenLimit: process.env.RATE_LIMIT_REQUESTS || 5,
  // Time window in milliseconds (default: 60 seconds)
  window: parseInt(process.env.RATE_LIMIT_DURATION || 60000),
}

// Initialize a cache to store IP addresses and their request counts
const tokenCache = new LRUCache({
  max: 500, // Maximum number of IPs to track
  ttl: rateLimit.window, // Time to live for each entry
})

export default async function rateLimiter(req) {
  // Get the client IP from various headers (supports proxies and Vercel)
  const clientIp = 
    req.headers['x-forwarded-for'] || 
    req.headers['x-real-ip'] || 
    req.socket?.remoteAddress || 
    '127.0.0.1'
  
  const tokenCount = (tokenCache.get(clientIp) || 0) + 1
  
  // Store the incremented token count
  tokenCache.set(clientIp, tokenCount)
  
  // Calculate remaining tokens and reset time
  const currentTokens = tokenCount
  const remainingTokens = Math.max(0, rateLimit.tokenLimit - currentTokens)
  const resetTime = new Date(Date.now() + rateLimit.window)
  
  // Set rate limit headers (useful for debugging or client-side handling)
  const headers = {
    'X-RateLimit-Limit': rateLimit.tokenLimit,
    'X-RateLimit-Remaining': remainingTokens,
    'X-RateLimit-Reset': resetTime.toISOString(),
  }
  
  // Check if the request should be limited
  const isRateLimited = currentTokens > rateLimit.tokenLimit
  
  return { 
    headers,
    isRateLimited,
    remainingTokens
  }
}
