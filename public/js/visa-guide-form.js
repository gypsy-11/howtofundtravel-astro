// Visa Guide Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const visaForm = document.querySelector('.newsletter-form');
    
    if (visaForm) {
        visaForm.addEventListener('submit', handleVisaFormSubmit);
    }
});

async function handleVisaFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('#email');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Get form data
    const email = emailInput.value.trim();
    
    // Basic validation
    if (!email) {
        showMessage('Please enter your email address.', 'error');
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    try {
        // Determine the server URL based on environment
        const serverUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3001' 
            : 'https://howtofundtravel.vercel.app'; // Your Vercel deployment URL
        
        const response = await fetch(`${serverUrl}/api/submit-visa-guide`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Success - show success message and clear form
            showMessage(result.message, 'success');
            emailInput.value = '';
            
            // Optional: Redirect to thank you page after a short delay
            setTimeout(() => {
                window.location.href = '/thank-you-visa-guide.html';
            }, 2000);
            
        } else {
            // Show error message
            showMessage(result.message, 'error');
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Sorry, something went wrong. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

function showMessage(message, type = 'info') {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message--${type}`;
    messageElement.textContent = message;
    
    // Add styles
    messageElement.style.cssText = `
        padding: 12px 16px;
        margin: 16px 0;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        ${type === 'success' ? `
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        ` : type === 'error' ? `
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        ` : `
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        `}
    `;
    
    // Insert message after the form
    const form = document.querySelector('.newsletter-form');
    form.parentNode.insertBefore(messageElement, form.nextSibling);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}

// Add some basic styles for the form messages
const style = document.createElement('style');
style.textContent = `
    .form-message {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .newsletter-form button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style); 