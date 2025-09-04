// Vibe Nomads community signup API endpoint
// Enhanced with better validation, rate limiting, and spam protection

export const prerender = false;

import { 
  validateEmail, 
  checkRateLimit, 
  detectSpam, 
  getClientIP, 
  createErrorResponse, 
  createSuccessResponse, 
  validateFormData, 
  handleMailerLiteError, 
  logFormSubmission 
} from '../../utils/formValidation.js';

export async function POST({ request }) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return createErrorResponse(
        'Too many requests. Please wait a moment and try again.',
        429,
        'rate_limit_exceeded'
      );
    }
    
    // Parse the request body
    const data = await request.json();
    const { email, website, timestamp, userAgent } = data;
    
    // Log submission (with privacy protection)
    logFormSubmission('Vibe Nomads community signup', data);
    
    // Validate form data
    const validationErrors = validateFormData(data);
    if (validationErrors.length > 0) {
      return createErrorResponse(validationErrors[0], 400, 'validation_error');
    }
    
    // Check for spam indicators
    const spamIndicators = detectSpam(data);
    if (spamIndicators.length > 0) {
      console.log('Spam detected:', spamIndicators);
      // Return success to avoid revealing spam detection
      return createSuccessResponse(
        'Thank you for your interest!',
        '/thank-you-vibe-nomads'
      );
    }

    // Vibe Nomads community group ID
    const VIBE_NOMADS_GROUP_ID = '161603576977688029';

    // Use the same direct MailerLite API call as the working HTML version
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        email: email,
        groups: [VIBE_NOMADS_GROUP_ID],
        fields: {
          source: 'vibe_nomads_community_signup',
          signup_date: new Date().toISOString(),
          lead_magnet: 'vibe_nomads_community',
          user_agent: userAgent || 'unknown'
        }
      })
    });

    if (response.ok) {
      console.log(`Successfully added ${email} to Vibe Nomads community group`);
      return createSuccessResponse(
        'Successfully subscribed!',
        '/thank-you-vibe-nomads'
      );
    } else {
      const errorData = await response.json();
      console.error('MailerLite API error:', errorData);
      return handleMailerLiteError(response, errorData);
    }
  } catch (error) {
    console.error('Error subscribing to Vibe Nomads community:', error);
    
    let errorMessage = 'Error processing your request. Please try again.';
    
    if (error.name === 'SyntaxError') {
      errorMessage = 'Invalid request format.';
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Service temporarily unavailable. Please try again later.';
    }
    
    return createErrorResponse(errorMessage, 500, 'server_error');
  }
}
