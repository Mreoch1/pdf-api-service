#!/bin/bash

# Run all tests and generate report

echo "🧪 Running All Tests"
echo "===================="
echo ""

# Run Jest tests
echo "📦 Unit Tests:"
npm test

echo ""
echo "📊 Test Summary:"
echo "===================="
echo "✅ Unit tests completed"
echo ""
echo "💡 To run integration tests:"
echo "   1. Start dev server: npm run dev"
echo "   2. In another terminal: npm run test:api"
echo ""

