#!/usr/bin/env node

/**
 * Newsletter Form Test Runner
 * Run this script to test all newsletter form functionality
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan');
  log(message, 'bright');
  log('='.repeat(60), 'cyan');
}

function logSection(message) {
  log('\n' + '-'.repeat(40), 'yellow');
  log(message, 'yellow');
  log('-'.repeat(40), 'yellow');
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
 * Check if development server is running
 */
async function checkDevServer() {
  return new Promise((resolve) => {
    const http = require('http');
    const req = http.request({
      hostname: 'localhost',
      port: 4321,
      path: '/',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

/**
 * Start development server
 */
function startDevServer() {
  return new Promise((resolve, reject) => {
    logInfo('Starting Astro development server...');
    
    const devProcess = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    let serverStarted = false;

    devProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      if (output.includes('Local:') && output.includes('http://localhost:4321')) {
        serverStarted = true;
        logSuccess('Development server started successfully!');
        resolve(devProcess);
      }
    });

    devProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    devProcess.on('error', (error) => {
      logError(`Failed to start development server: ${error.message}`);
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverStarted) {
        devProcess.kill();
        reject(new Error('Development server failed to start within 30 seconds'));
      }
    }, 30000);
  });
}

/**
 * Test API endpoints
 */
async function testApiEndpoints() {
  logSection('Testing API Endpoints');
  
  const endpoints = [
    {
      name: 'Newsletter Subscription',
      path: '/api/newsletter-subscribe',
      expectedStatus: 200
    },
    {
      name: 'Job Bookmarks Lead Magnet',
      path: '/api/job-bookmarks-lead-magnet',
      expectedStatus: 200
    },
    {
      name: 'AI Tools Lead Magnet',
      path: '/api/ai-tools-bookmarks-lead-magnet',
      expectedStatus: 200
    },
    {
      name: 'Visa Guide Download',
      path: '/api/visa-guide-download',
      expectedStatus: 200
    },
    {
      name: 'Vibe Nomads Signup',
      path: '/api/vibe-nomads-signup',
      expectedStatus: 200
    }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:4321${endpoint.path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' })
      });

      const data = await response.json();
      const success = response.status === endpoint.expectedStatus;
      
      if (success) {
        logSuccess(`${endpoint.name}: ${response.status} OK`);
      } else {
        logError(`${endpoint.name}: Expected ${endpoint.expectedStatus}, got ${response.status}`);
      }

      results.push({
        name: endpoint.name,
        success,
        status: response.status,
        data
      });

    } catch (error) {
      logError(`${endpoint.name}: ${error.message}`);
      results.push({
        name: endpoint.name,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}

/**
 * Test form validation
 */
function testFormValidation() {
  logSection('Testing Form Validation');
  
  const testCases = [
    { email: 'test@example.com', shouldBeValid: true },
    { email: 'invalid-email', shouldBeValid: false },
    { email: 'test@', shouldBeValid: false },
    { email: '@example.com', shouldBeValid: false },
    { email: 'test.example.com', shouldBeValid: false },
    { email: 'test+tag@example.com', shouldBeValid: true },
    { email: 'test.name@example.co.uk', shouldBeValid: true }
  ];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let allTestsPassed = true;

  testCases.forEach(testCase => {
    const isValid = emailRegex.test(testCase.email);
    const testPassed = isValid === testCase.shouldBeValid;
    
    if (testPassed) {
      logSuccess(`Email validation: "${testCase.email}" - ${isValid ? 'valid' : 'invalid'}`);
    } else {
      logError(`Email validation: "${testCase.email}" - expected ${testCase.shouldBeValid ? 'valid' : 'invalid'}, got ${isValid ? 'valid' : 'invalid'}`);
      allTestsPassed = false;
    }
  });

  return allTestsPassed;
}

/**
 * Check environment configuration
 */
function checkEnvironment() {
  logSection('Checking Environment Configuration');
  
  let allChecksPassed = true;

  // Check if package.json exists
  if (fs.existsSync('package.json')) {
    logSuccess('package.json found');
  } else {
    logError('package.json not found');
    allChecksPassed = false;
  }

  // Check if MailerLite package is installed
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.dependencies && packageJson.dependencies['@mailerlite/mailerlite-nodejs']) {
    logSuccess('MailerLite package is installed');
  } else {
    logError('MailerLite package is not installed');
    allChecksPassed = false;
  }

  // Check if API endpoints exist
  const apiEndpoints = [
    'src/pages/api/newsletter-subscribe.js',
    'src/pages/api/job-bookmarks-lead-magnet.js',
    'src/pages/api/ai-tools-bookmarks-lead-magnet.js',
    'src/pages/api/visa-guide-download.js',
    'src/pages/api/vibe-nomads-signup.js'
  ];

  apiEndpoints.forEach(endpoint => {
    if (fs.existsSync(endpoint)) {
      logSuccess(`${endpoint} exists`);
    } else {
      logError(`${endpoint} not found`);
      allChecksPassed = false;
    }
  });

  // Check for environment variables
  if (process.env.MAILERLITE_API_KEY) {
    logSuccess('MAILERLITE_API_KEY environment variable is set');
  } else {
    logWarning('MAILERLITE_API_KEY environment variable is not set');
    logInfo('You may need to set this for full functionality testing');
  }

  return allChecksPassed;
}

/**
 * Generate test report
 */
function generateReport(apiResults, validationPassed, envPassed) {
  logHeader('Test Report');
  
  const totalApiTests = apiResults.length;
  const passedApiTests = apiResults.filter(r => r.success).length;
  const totalTests = totalApiTests + 2; // +2 for validation and environment
  const passedTests = passedApiTests + (validationPassed ? 1 : 0) + (envPassed ? 1 : 0);
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);

  log(`Total Tests: ${totalTests}`, 'bright');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${totalTests - passedTests}`, 'red');
  log(`Success Rate: ${successRate}%`, 'bright');

  if (passedTests === totalTests) {
    logSuccess('All tests passed! Newsletter functionality is working correctly.');
  } else {
    logError('Some tests failed. Please review the issues above.');
  }

  // Failed API tests
  const failedApiTests = apiResults.filter(r => !r.success);
  if (failedApiTests.length > 0) {
    log('\nFailed API Tests:', 'red');
    failedApiTests.forEach(test => {
      logError(`${test.name}: ${test.error || `Status ${test.status}`}`);
    });
  }

  // Recommendations
  log('\nRecommendations:', 'cyan');
  if (passedTests === totalTests) {
    logInfo('✅ Newsletter functionality is ready for production');
    logInfo('✅ Consider running manual tests with real email addresses');
    logInfo('✅ Monitor MailerLite dashboard for successful subscriptions');
  } else {
    logWarning('⚠️  Fix failed tests before deploying to production');
    logWarning('⚠️  Review error handling and user experience');
    logWarning('⚠️  Verify MailerLite API key configuration');
  }

  return {
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    successRate: parseFloat(successRate),
    apiResults,
    validationPassed,
    envPassed
  };
}

/**
 * Main test runner
 */
async function runTests() {
  logHeader('Newsletter Form Testing Suite');
  logInfo('Starting comprehensive newsletter form testing...');

  let devProcess = null;
  let report = null;

  try {
    // Check environment
    const envPassed = checkEnvironment();

    // Check if dev server is running
    const serverRunning = await checkDevServer();
    
    if (!serverRunning) {
      logInfo('Development server not running. Starting it now...');
      devProcess = await startDevServer();
      
      // Wait a bit for server to fully start
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      logSuccess('Development server is already running');
    }

    // Test form validation
    const validationPassed = testFormValidation();

    // Test API endpoints
    const apiResults = await testApiEndpoints();

    // Generate report
    report = generateReport(apiResults, validationPassed, envPassed);

  } catch (error) {
    logError(`Test suite error: ${error.message}`);
    process.exit(1);
  } finally {
    // Clean up
    if (devProcess) {
      logInfo('Stopping development server...');
      devProcess.kill();
    }
  }

  // Exit with appropriate code
  if (report && report.failedTests === 0) {
    logSuccess('All tests completed successfully!');
    process.exit(0);
  } else {
    logError('Some tests failed. Please review the report above.');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(error => {
    logError(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  runTests,
  checkDevServer,
  testApiEndpoints,
  testFormValidation,
  checkEnvironment
};
