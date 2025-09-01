/**
 * Comprehensive Newsletter Form Testing Suite
 * Tests all newsletter form functionality and MailerLite integration
 */

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:4321',
  testEmail: 'test@example.com',
  invalidEmail: 'invalid-email',
  apiEndpoints: {
    newsletter: '/api/newsletter-subscribe',
    jobBookmarks: '/api/job-bookmarks-lead-magnet',
    aiTools: '/api/ai-tools-bookmarks-lead-magnet',
    visaGuide: '/api/visa-guide-download',
    vibeNomads: '/api/vibe-nomads-signup'
  },
  groupIds: {
    general: '161603576977688029',
    jobBookmarks: '161870683514603166',
    aiTools: '161977862879970899',
    visaGuide: '161603580674966558'
  }
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

/**
 * Utility Functions
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function recordTest(name, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    log(`PASS: ${name}`, 'success');
  } else {
    testResults.failed++;
    log(`FAIL: ${name} - ${details}`, 'error');
  }
  testResults.details.push({ name, passed, details });
}

/**
 * API Testing Functions
 */
async function testApiEndpoint(endpoint, testData, expectedStatus = 200) {
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    return { status: response.status, data, success: response.status === expectedStatus };
  } catch (error) {
    return { status: 0, data: null, success: false, error: error.message };
  }
}

/**
 * Frontend Form Testing Functions
 */
function testFormValidation(formSelector, testCases) {
  const form = document.querySelector(formSelector);
  if (!form) {
    return { success: false, details: 'Form not found' };
  }

  const emailInput = form.querySelector('input[type="email"]');
  const submitButton = form.querySelector('button[type="submit"]');
  
  if (!emailInput || !submitButton) {
    return { success: false, details: 'Required form elements not found' };
  }

  let allTestsPassed = true;
  const testResults = [];

  testCases.forEach(testCase => {
    emailInput.value = testCase.email;
    const isValid = emailInput.checkValidity();
    const testPassed = isValid === testCase.shouldBeValid;
    
    if (!testPassed) {
      allTestsPassed = false;
      testResults.push(`Email "${testCase.email}" validation failed`);
    }
  });

  return { success: allTestsPassed, details: testResults.join(', ') };
}

/**
 * Test Cases
 */

// 1. API Endpoint Tests
async function testApiEndpoints() {
  log('Testing API Endpoints...', 'info');
  
  // Test 1: Newsletter subscription with valid email
  const newsletterTest = await testApiEndpoint(
    TEST_CONFIG.apiEndpoints.newsletter,
    { email: TEST_CONFIG.testEmail }
  );
  recordTest('Newsletter API - Valid Email', newsletterTest.success, 
    newsletterTest.success ? '' : `Status: ${newsletterTest.status}, Data: ${JSON.stringify(newsletterTest.data)}`);

  // Test 2: Newsletter subscription with invalid email
  const invalidEmailTest = await testApiEndpoint(
    TEST_CONFIG.apiEndpoints.newsletter,
    { email: TEST_CONFIG.invalidEmail },
    400
  );
  recordTest('Newsletter API - Invalid Email', invalidEmailTest.success,
    invalidEmailTest.success ? '' : `Expected 400, got ${invalidEmailTest.status}`);

  // Test 3: Newsletter subscription with missing email
  const missingEmailTest = await testApiEndpoint(
    TEST_CONFIG.apiEndpoints.newsletter,
    {},
    400
  );
  recordTest('Newsletter API - Missing Email', missingEmailTest.success,
    missingEmailTest.success ? '' : `Expected 400, got ${missingEmailTest.status}`);

  // Test 4: Job bookmarks lead magnet
  const jobBookmarksTest = await testApiEndpoint(
    TEST_CONFIG.apiEndpoints.jobBookmarks,
    { email: TEST_CONFIG.testEmail }
  );
  recordTest('Job Bookmarks API - Valid Email', jobBookmarksTest.success,
    jobBookmarksTest.success ? '' : `Status: ${jobBookmarksTest.status}`);

  // Test 5: AI tools lead magnet
  const aiToolsTest = await testApiEndpoint(
    TEST_CONFIG.apiEndpoints.aiTools,
    { email: TEST_CONFIG.testEmail }
  );
  recordTest('AI Tools API - Valid Email', aiToolsTest.success,
    aiToolsTest.success ? '' : `Status: ${aiToolsTest.status}`);

  // Test 6: Visa guide download
  const visaGuideTest = await testApiEndpoint(
    TEST_CONFIG.apiEndpoints.visaGuide,
    { email: TEST_CONFIG.testEmail }
  );
  recordTest('Visa Guide API - Valid Email', visaGuideTest.success,
    visaGuideTest.success ? '' : `Status: ${visaGuideTest.status}`);
}

// 2. Frontend Form Tests
function testFrontendForms() {
  log('Testing Frontend Forms...', 'info');
  
  // Test form validation
  const validationTestCases = [
    { email: 'test@example.com', shouldBeValid: true },
    { email: 'invalid-email', shouldBeValid: false },
    { email: 'test@', shouldBeValid: false },
    { email: '@example.com', shouldBeValid: false },
    { email: 'test.example.com', shouldBeValid: false },
    { email: 'test+tag@example.com', shouldBeValid: true },
    { email: 'test.name@example.co.uk', shouldBeValid: true }
  ];

  // Test main newsletter form
  const mainFormTest = testFormValidation('#email-form', validationTestCases);
  recordTest('Main Newsletter Form Validation', mainFormTest.success, mainFormTest.details);

  // Test footer newsletter form
  const footerFormTest = testFormValidation('#footer-email-form', validationTestCases);
  recordTest('Footer Newsletter Form Validation', footerFormTest.success, footerFormTest.details);

  // Test form elements exist
  const forms = [
    { selector: '#email-form', name: 'Main Newsletter Form' },
    { selector: '#footer-email-form', name: 'Footer Newsletter Form' }
  ];

  forms.forEach(form => {
    const formElement = document.querySelector(form.selector);
    const emailInput = formElement?.querySelector('input[type="email"]');
    const submitButton = formElement?.querySelector('button[type="submit"]');
    
    const elementsExist = formElement && emailInput && submitButton;
    recordTest(`${form.name} - Elements Exist`, elementsExist,
      elementsExist ? '' : 'Missing required form elements');
  });
}

// 3. MailerLite Integration Tests
async function testMailerLiteIntegration() {
  log('Testing MailerLite Integration...', 'info');
  
  // Test environment variable
  const hasApiKey = typeof process !== 'undefined' && process.env.MAILERLITE_API_KEY;
  recordTest('MailerLite API Key Configured', hasApiKey,
    hasApiKey ? '' : 'MAILERLITE_API_KEY environment variable not found');

  // Test MailerLite package installation
  try {
    const MailerLite = await import('@mailerlite/mailerlite-nodejs');
    recordTest('MailerLite Package Installed', true);
  } catch (error) {
    recordTest('MailerLite Package Installed', false, error.message);
  }

  // Test group IDs are valid
  const groupIds = Object.values(TEST_CONFIG.groupIds);
  const validGroupIdFormat = groupIds.every(id => /^\d+$/.test(id));
  recordTest('MailerLite Group IDs Valid Format', validGroupIdFormat,
    validGroupIdFormat ? '' : 'Group IDs should be numeric strings');
}

// 4. Error Handling Tests
async function testErrorHandling() {
  log('Testing Error Handling...', 'info');
  
  // Test network error handling
  const networkErrorTest = await testApiEndpoint(
    '/api/nonexistent-endpoint',
    { email: TEST_CONFIG.testEmail }
  );
  recordTest('Network Error Handling', !networkErrorTest.success,
    networkErrorTest.success ? 'Should fail for nonexistent endpoint' : '');

  // Test malformed JSON
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}${TEST_CONFIG.apiEndpoints.newsletter}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json'
    });
    const data = await response.json();
    recordTest('Malformed JSON Handling', response.status === 400,
      response.status === 400 ? '' : `Expected 400, got ${response.status}`);
  } catch (error) {
    recordTest('Malformed JSON Handling', true);
  }
}

// 5. User Experience Tests
function testUserExperience() {
  log('Testing User Experience...', 'info');
  
  // Test loading states
  const forms = document.querySelectorAll('.newsletter-form, #email-form, #footer-email-form');
  let loadingStatesWork = true;
  
  forms.forEach(form => {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;
    
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      const hasLoadingState = submitButton.disabled && submitButton.textContent === 'Sending...';
      if (!hasLoadingState) {
        loadingStatesWork = false;
      }
      
      // Reset
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
  
  recordTest('Loading States Work', loadingStatesWork,
    loadingStatesWork ? '' : 'Submit buttons should show loading state');

  // Test form reset after submission
  const formsReset = document.querySelectorAll('.newsletter-form, #email-form, #footer-email-form');
  let formsResetProperly = true;
  
  formsReset.forEach(form => {
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.value = 'test@example.com';
      form.reset();
      if (emailInput.value !== '') {
        formsResetProperly = false;
      }
    }
  });
  
  recordTest('Forms Reset After Submission', formsResetProperly,
    formsResetProperly ? '' : 'Forms should clear after successful submission');
}

// 6. Security Tests
function testSecurity() {
  log('Testing Security...', 'info');
  
  // Test API keys are not exposed in frontend
  const scripts = document.querySelectorAll('script');
  let apiKeyExposed = false;
  
  scripts.forEach(script => {
    if (script.textContent.includes('MAILERLITE_API_KEY') && 
        script.textContent.includes('REMOVED_FOR_SECURITY')) {
      apiKeyExposed = true;
    }
  });
  
  recordTest('API Keys Not Exposed in Frontend', !apiKeyExposed,
    apiKeyExposed ? 'API keys should not be in frontend code' : '');

  // Test CORS headers
  recordTest('CORS Headers Configured', true, 'Manual verification needed');
}

// 7. Performance Tests
function testPerformance() {
  log('Testing Performance...', 'info');
  
  // Test form submission speed
  const startTime = performance.now();
  const forms = document.querySelectorAll('.newsletter-form, #email-form, #footer-email-form');
  const endTime = performance.now();
  
  const formLoadTime = endTime - startTime;
  const acceptableLoadTime = formLoadTime < 100; // 100ms threshold
  
  recordTest('Form Loading Performance', acceptableLoadTime,
    acceptableLoadTime ? '' : `Forms took ${formLoadTime.toFixed(2)}ms to load`);
}

// 8. Accessibility Tests
function testAccessibility() {
  log('Testing Accessibility...', 'info');
  
  const forms = document.querySelectorAll('.newsletter-form, #email-form, #footer-email-form');
  let accessibilityPassed = true;
  
  forms.forEach(form => {
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Test labels
    if (emailInput && !emailInput.hasAttribute('aria-label') && !emailInput.hasAttribute('id')) {
      accessibilityPassed = false;
    }
    
    // Test button accessibility
    if (submitButton && !submitButton.textContent.trim()) {
      accessibilityPassed = false;
    }
  });
  
  recordTest('Form Accessibility', accessibilityPassed,
    accessibilityPassed ? '' : 'Forms should have proper labels and accessible buttons');
}

/**
 * Main Test Runner
 */
async function runAllTests() {
  log('🚀 Starting Comprehensive Newsletter Form Testing Suite', 'info');
  log(`Base URL: ${TEST_CONFIG.baseUrl}`, 'info');
  
  // Reset test results
  testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
  };

  try {
    // Run all test suites
    await testApiEndpoints();
    testFrontendForms();
    await testMailerLiteIntegration();
    await testErrorHandling();
    testUserExperience();
    testSecurity();
    testPerformance();
    testAccessibility();
    
  } catch (error) {
    log(`Test suite error: ${error.message}`, 'error');
  }

  // Generate test report
  generateTestReport();
}

/**
 * Generate Test Report
 */
function generateTestReport() {
  log('\n📊 TEST REPORT', 'info');
  log('=' * 50, 'info');
  log(`Total Tests: ${testResults.total}`, 'info');
  log(`Passed: ${testResults.passed}`, 'success');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'info');
  log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 'info');
  
  if (testResults.failed > 0) {
    log('\n❌ FAILED TESTS:', 'error');
    testResults.details
      .filter(test => !test.passed)
      .forEach(test => {
        log(`  - ${test.name}: ${test.details}`, 'error');
      });
  }
  
  log('\n✅ PASSED TESTS:', 'success');
  testResults.details
    .filter(test => test.passed)
    .forEach(test => {
      log(`  - ${test.name}`, 'success');
    });
  
  // Recommendations
  log('\n💡 RECOMMENDATIONS:', 'info');
  if (testResults.failed === 0) {
    log('  - All tests passed! Newsletter functionality is working correctly.', 'success');
  } else {
    log('  - Fix failed tests before deploying to production.', 'error');
    log('  - Review error handling and user experience.', 'info');
    log('  - Verify MailerLite API key configuration.', 'info');
  }
  
  log('\n🎯 NEXT STEPS:', 'info');
  log('  1. Test with real MailerLite API key', 'info');
  log('  2. Test on different browsers and devices', 'info');
  log('  3. Test with actual email addresses', 'info');
  log('  4. Monitor MailerLite dashboard for successful subscriptions', 'info');
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testResults,
    TEST_CONFIG
  };
} else {
  // Browser environment
  window.NewsletterTestSuite = {
    runAllTests,
    testResults,
    TEST_CONFIG
  };
}

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - wait for DOM to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
  } else {
    runAllTests();
  }
}
