#!/usr/bin/env python3
"""
Simple script to test Ribbon API connectivity
Run this to diagnose Ribbon API issues
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_ribbon_connection():
    """Test basic connectivity to Ribbon AI API"""
    
    # Check if token is configured
    token = os.getenv("RIBBON_TOKEN")
    if not token:
        print("❌ ERROR: RIBBON_TOKEN environment variable not set!")
        print("   Please set RIBBON_TOKEN in your .env file")
        return False
    
    print(f"✅ Token found: {token[:10]}...")
    
    # Test ping endpoint
    try:
        url = "https://app.ribbon.ai/be-api/v1/ping"
        headers = {
            "accept": "application/json", 
            "authorization": f"Bearer {token}"
        }
        
        print(f"🔄 Testing connection to: {url}")
        response = requests.get(url, headers=headers, timeout=10)
        
        print(f"📊 Response Status: {response.status_code}")
        print(f"📊 Response Headers: {dict(response.headers)}")
        
        if response.ok:
            print("✅ SUCCESS: Ribbon API is responding!")
            try:
                data = response.json()
                print(f"📄 Response Data: {data}")
                return True
            except Exception as e:
                print(f"⚠️  Response is not valid JSON: {e}")
                print(f"📄 Raw Response: {response.text}")
                return False
        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            print(f"📄 Error Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ ERROR: Request timed out - check your internet connection")
        return False
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Could not connect to Ribbon AI - check your internet connection")
        return False
    except Exception as e:
        print(f"❌ ERROR: Unexpected error - {str(e)}")
        return False

def test_mongodb_connection():
    """Test MongoDB connectivity"""
    try:
        from pymongo import MongoClient
        mongodb_uri = os.getenv('MONGODB_URI')
        if not mongodb_uri:
            print("❌ ERROR: MONGODB_URI environment variable not set!")
            return False
            
        print(f"🔄 Testing MongoDB connection...")
        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("✅ SUCCESS: MongoDB is connected!")
        return True
    except Exception as e:
        print(f"❌ FAILED: MongoDB connection error - {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Ribbon API Connection Test")
    print("=" * 40)
    
    print("\n1. Testing Environment Variables...")
    env_ok = True
    for var in ['RIBBON_TOKEN', 'MONGODB_URI']:
        value = os.getenv(var)
        if value:
            print(f"✅ {var}: Set")
        else:
            print(f"❌ {var}: Not set")
            env_ok = False
    
    print("\n2. Testing MongoDB Connection...")
    mongo_ok = test_mongodb_connection()
    
    print("\n3. Testing Ribbon AI API...")
    ribbon_ok = test_ribbon_connection()
    
    print("\n" + "=" * 40)
    if env_ok and mongo_ok and ribbon_ok:
        print("🎉 ALL TESTS PASSED! Your setup should work.")
    else:
        print("❌ SOME TESTS FAILED. Check the errors above.")
        
    print("\nNext steps:")
    print("- If token issues: Check your .env file has RIBBON_TOKEN set")
    print("- If API issues: Verify your Ribbon AI account and token validity")
    print("- If MongoDB issues: Check your MONGODB_URI and database connectivity") 