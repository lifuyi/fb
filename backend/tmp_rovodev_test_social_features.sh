#!/bin/bash

API_URL="http://localhost:8000/api"

echo "=========================================="
echo "Testing Social Features (Follow & Notifications)"
echo "=========================================="
echo ""

# Login as Alice
echo "1. Login as Alice..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/email-login" \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@hit.edu.cn", "password": "password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to login"
  exit 1
fi

echo "✅ Login successful"
echo ""

# Get Alice's profile
echo "2. Get Alice's profile..."
curl -s -X GET "${API_URL}/profile" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | grep -A 5 "stats"
echo ""

# Get Bob's profile (user_id: 2)
echo "3. Get Bob's profile..."
curl -s -X GET "${API_URL}/profile/2" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | grep -A 6 "stats"
echo ""

# Get Alice's followers
echo "4. Get Alice's followers..."
curl -s -X GET "${API_URL}/follow/followers" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -30
echo ""

# Get Alice's following
echo "5. Get Alice's following..."
curl -s -X GET "${API_URL}/follow/following" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -30
echo ""

# Check if Alice is following Bob
echo "6. Check follow status (Alice -> Bob)..."
curl -s -X GET "${API_URL}/follow/status/2" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# Get notifications
echo "7. Get Alice's notifications..."
curl -s -X GET "${API_URL}/notifications" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -50
echo ""

# Get unread count
echo "8. Get unread notification count..."
curl -s -X GET "${API_URL}/notifications/unread-count" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# Login as Carol and follow Alice
echo "9. Login as Carol and follow Bob..."
CAROL_TOKEN=$(curl -s -X POST "${API_URL}/auth/email-login" \
  -H "Content-Type: application/json" \
  -d '{"email": "carol@nefu.edu.cn", "password": "password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Try to follow Bob (should fail as already following)
echo "10. Carol tries to follow Bob (already following)..."
curl -s -X POST "${API_URL}/follow/2" \
  -H "Authorization: Bearer $CAROL_TOKEN" \
  -H "Content-Type: application/json" | python3 -m json.tool
echo ""

# Unfollow Bob
echo "11. Carol unfollows Bob..."
curl -s -X DELETE "${API_URL}/follow/2" \
  -H "Authorization: Bearer $CAROL_TOKEN" | python3 -m json.tool
echo ""

# Follow Bob again
echo "12. Carol follows Bob again (should create notification)..."
curl -s -X POST "${API_URL}/follow/2" \
  -H "Authorization: Bearer $CAROL_TOKEN" \
  -H "Content-Type: application/json" | python3 -m json.tool
echo ""

# Bob checks notifications
echo "13. Bob checks notifications (should see new follow from Carol)..."
BOB_TOKEN=$(curl -s -X POST "${API_URL}/auth/email-login" \
  -H "Content-Type: application/json" \
  -d '{"email": "bob@hrbeu.edu.cn", "password": "password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -s -X GET "${API_URL}/notifications" \
  -H "Authorization: Bearer $BOB_TOKEN" | python3 -m json.tool | head -40
echo ""

echo "=========================================="
echo "Social Features Tests Completed! ✅"
echo "=========================================="
