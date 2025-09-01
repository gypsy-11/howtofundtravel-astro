// Job bookmarks lead magnet API endpoint
// Enhanced with better validation, rate limiting, and spam protection

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
    logFormSubmission('Job bookmarks lead magnet', data);
    
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
        '/thank-you-job-bookmarks'
      );
    }

    // Job bookmarks lead magnet group ID
    const JOB_BOOKMARKS_GROUP_ID = '161870683514603166';

    // Use the same direct MailerLite API call as the working HTML version
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        email: email,
        groups: [JOB_BOOKMARKS_GROUP_ID],
        fields: {
          source: 'job_bookmarks_lead_magnet',
          signup_date: new Date().toISOString(),
          lead_magnet: 'job_sites_bookmarks',
          user_agent: userAgent || 'unknown'
        }
      })
    });

    if (response.ok) {
      console.log(`Successfully added ${email} to job bookmarks group`);
      return createSuccessResponse(
        'Successfully subscribed!',
        '/thank-you-job-bookmarks'
      );
    } else {
      const errorData = await response.json();
      console.error('MailerLite API error:', errorData);
      return handleMailerLiteError(response, errorData);
    }
  } catch (error) {
    console.error('Error subscribing to job bookmarks:', error);
    
    let errorMessage = 'Error processing your request. Please try again.';
    
    if (error.name === 'SyntaxError') {
      errorMessage = 'Invalid request format.';
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Service temporarily unavailable. Please try again later.';
    }
    
    return createErrorResponse(errorMessage, 500, 'server_error');
  }
}
