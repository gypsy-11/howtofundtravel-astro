#!/usr/bin/env node

/**
 * Quick Newsletter Functionality Test
 * Tests the basic newsletter form functionality
 */

const fetch = require('node-fetch');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:4321',
  testEmail: 'test@example.com',
  apiEndpoints: [
    '/api/newsletter-subscribe',
    '/api/job-bookmarks-lead-magnet',
    '/api/ai-tools-bookmarks-lead-magnet',
    '/api/visa-guide-download',
    '/api/vibe-nomads-signup'
  ]
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

/**
 * Test API endpoint
 */
async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: TEST_CONFIG.testEmail })
    });

    const data = await response.json();
    
    if (response.ok) {
      logSuccess(`${endpoint}: ${response.status} OK`);
      return { success: true, status: response.status, data };
    } else {
      logError(`${endpoint}: Expected 200, got ${response.status}`);
      return { success: false, status: response.status, data };
    }
  } catch (error) {
    logError(`${endpoint}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Check if development server is running
 */
async function checkDevServer() {
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Main test function
 */
async function runQuickTest() {
  log('\n🚀 Quick Newsletter Functionality Test', 'blue');
  log('=' * 50, 'blue');
  
  // Check if dev server is running
  logInfo('Checking if development server is running...');
  const serverRunning = await checkDevServer();
  
  if (!serverRunning) {
    logError('Development server is not running on http://localhost:4321');
    logInfo('Please start the server with: npm run dev');
    process.exit(1);
  }
  
  logSuccess('Development server is running');
  
  // Test all API endpoints
  logInfo('Testing newsletter API endpoints...');
  
  const results = [];
  
  for (const endpoint of TEST_CONFIG.apiEndpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ endpoint, ...result });
  }
  
  // Generate summary
  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  log('\n📊 Test Summary', 'blue');
  log(`Total Tests: ${totalTests}`);
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${totalTests - passedTests}`, 'red');
  log(`Success Rate: ${successRate}%`);
  
  if (passedTests === totalTests) {
    logSuccess('All newsletter API endpoints are working correctly!');
    logInfo('✅ Newsletter functionality is ready for testing');
  } else {
    logWarning('Some API endpoints failed. Check the errors above.');
    logInfo('⚠️  Review the failed endpoints before proceeding');
  }
  
  // Next steps
  log('\n🎯 Next Steps:', 'blue');
  logInfo('1. Test forms manually in the browser');
  logInfo('2. Verify MailerLite integration with real API key');
  logInfo('3. Check form styling and user experience');
  logInfo('4. Test on different browsers and devices');
  
  return {
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    successRate: parseFloat(successRate),
    results
  };
}

// Run test if this file is executed directly
if (require.main === module) {
  runQuickTest()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      logError(`Test failed: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { runQuickTest };
