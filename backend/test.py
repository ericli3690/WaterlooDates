import requests
import json

BASE_URL = "http://localhost:5000"

def test_create_user(name, email, age):
    url = f"{BASE_URL}/api/users"
    payload = {
        "name": name,
        "email": email,
        "age": age
    }
    response = requests.post(url, json=payload)
    print("Create User Response:", response.status_code, response.json())
    return response.json().get('_id')

def test_get_users():
    url = f"{BASE_URL}/api/users"
    response = requests.get(url)
    print("Get Users Response:", response.status_code)
    print(json.dumps(response.json(), indent=2))

def test_get_user(user_id):
    url = f"{BASE_URL}/api/users/{user_id}"
    response = requests.get(url)
    print(f"Get User {user_id} Response:", response.status_code)
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    # Create a user
    user_id = test_create_user("Alice Smith", "alice@example.com", 22)
    # Fetch all users
    test_get_users()
    # Fetch the created user by ID
    if user_id:
        test_get_user(user_id)
