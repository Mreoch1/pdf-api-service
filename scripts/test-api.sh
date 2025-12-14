#!/bin/bash

# Integration test script for PDF API
# This tests the actual API endpoints

BASE_URL="${1:-http://localhost:3000}"
API_KEY="${2:-}"

echo "🧪 Testing PDF API Service"
echo "=========================="
echo "Base URL: $BASE_URL"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_count=0
pass_count=0
fail_count=0

test_endpoint() {
  local name=$1
  local method=$2
  local endpoint=$3
  local headers=$4
  local body=$5
  local expected_status=$6

  test_count=$((test_count + 1))
  echo -n "Testing $name... "

  if [ -z "$body" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
      "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      $headers)
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
      "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$body" \
      $headers)
  fi

  http_code=$(echo "$response" | tail -n1)
  body_response=$(echo "$response" | sed '$d')

  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Status: $http_code)"
    pass_count=$((pass_count + 1))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $http_code)"
    echo "  Response: $body_response"
    fail_count=$((fail_count + 1))
    return 1
  fi
}

# Test health endpoint
test_endpoint "Health Check" "GET" "/api/health" "" "" "200"

# Test PDF generation without API key (should fail)
test_endpoint "PDF Generate (no API key)" "POST" "/api/pdf/generate" "" \
  '{"html": "<h1>Test</h1>"}' "401"

# Test PDF generation with invalid API key (should fail)
test_endpoint "PDF Generate (invalid key)" "POST" "/api/pdf/generate" \
  "-H 'X-API-Key: invalid-key'" '{"html": "<h1>Test</h1>"}' "401"

# Test with valid API key (if provided)
if [ -n "$API_KEY" ]; then
  test_endpoint "PDF Generate (valid key)" "POST" "/api/pdf/generate" \
    "-H 'X-API-Key: $API_KEY'" '{"html": "<h1>Test PDF</h1><p>This is a test.</p>"}' "200"
else
  echo -e "${YELLOW}⚠ Skipping PDF generation test (no API key provided)${NC}"
  echo "   To test with API key: $0 $BASE_URL your_api_key_here"
fi

echo ""
echo "=========================="
echo "Results: $pass_count/$test_count tests passed"
if [ $fail_count -eq 0 ]; then
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}$fail_count test(s) failed${NC}"
  exit 1
fi

