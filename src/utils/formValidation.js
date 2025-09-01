// Shared form validation utilities for API endpoints

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // 3 requests per minute per IP

// Enhanced email validation
export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Rate limiting function - RE-ENABLED WITH MORE LENIENT SETTINGS
export function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const requests = rateLimitMap.get(ip);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  rateLimitMap.set(ip, validRequests);
  
  // More lenient rate limiting - allow more requests per window
  if (validRequests.length >= MAX_REQUESTS_PER_WINDOW * 2) {
    return false;
  }
  
  validRequests.push(now);
  return true;
}

// Spam detection - DISABLED FOR TESTING
export function detectSpam(data) {
  // Temporarily disabled for testing - will re-enable later
  return [];
}

// Get client IP from request headers
export function getClientIP(request) {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') || // Cloudflare
         'unknown';
}

// Create standardized error response
export function createErrorResponse(message, status = 400, errorCode = null) {
  return new Response(
    JSON.stringify({ 
      success: false, 
      message,
      error: errorCode
    }),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Create standardized success response
export function createSuccessResponse(message, redirectUrl = null) {
  const response = {
    success: true,
    message
  };
  
  if (redirectUrl) {
    response.redirectUrl = redirectUrl;
  }
  
  return new Response(
    JSON.stringify(response),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Validate form data
export function validateFormData(data) {
  const errors = [];
  
  if (!data.email) {
    errors.push('Email address is required');
  } else if (!validateEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
}

// Handle MailerLite API errors
export function handleMailerLiteError(response, errorData) {
  let errorMessage = 'Failed to subscribe. Please try again.';
  let statusCode = 500;
  
  if (response.status === 422) {
    errorMessage = 'This email address is already subscribed.';
    statusCode = 422;
  } else if (response.status === 400) {
    errorMessage = 'Invalid email address. Please check and try again.';
    statusCode = 400;
  } else if (response.status === 401) {
    errorMessage = 'Service temporarily unavailable. Please try again later.';
    statusCode = 503;
  } else if (response.status === 429) {
    errorMessage = 'Too many requests. Please wait a moment and try again.';
    statusCode = 429;
  }
  
  return createErrorResponse(errorMessage, statusCode, 'mailerlite_error');
}

// Log form submission (with privacy protection)
export function logFormSubmission(formType, data) {
  console.log(`${formType} form submission:`, {
    email: data.email ? data.email.substring(0, 3) + '***' : 'missing',
    hasWebsite: !!data.website,
    timestamp: data.timestamp,
    userAgent: data.userAgent ? data.userAgent.substring(0, 50) + '...' : 'missing'
  });
}
