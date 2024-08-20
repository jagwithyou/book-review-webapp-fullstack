import requests

BASE_URL = "http://localhost:8001"

def test_user_a_create_user_a():
    #Get admin ntoken
    global admin_token
    response = requests.post(f"{BASE_URL}/users/login", json={
        "email": "admin@example.com",
        "password": "adminpassword"
    })
    assert response.status_code == 200
    admin_token = response.json()["access_token"]
    response = requests.post(f"{BASE_URL}/users/", json={
        "full_name": "User A",
        "display_name": "userA",
        "password": "passwordA",
        "email": "userA@example.com"
    })
    print(response.text)
    assert response.status_code == 200
    global user_a_id
    user_a_id = response.json()["id"]
    print(user_a_id)

def test_user_b_create_user_b():
    response = requests.post(f"{BASE_URL}/users/", json={
        "full_name": "User B",
        "display_name": "userB",
        "password": "passwordB",
        "email": "userB@example.com"
    })
    assert response.status_code == 200
    global user_b_id
    user_b_id = response.json()["id"]

def test_user_c_create_user_c():
    response = requests.post(f"{BASE_URL}/users/", json={
        "full_name": "User C",
        "display_name": "userC",
        "password": "passwordC",
        "email": "userC@example.com"
    })
    assert response.status_code == 200
    global user_c_id
    user_c_id = response.json()["id"]

def test_user_d_get_user_a():
    print(user_a_id)
    response = requests.get(f"{BASE_URL}/users/{user_a_id}")
    assert response.status_code == 200
    assert response.json()["display_name"] == "userA"

def test_user_e_update_user_a():
    response = requests.put(f"{BASE_URL}/users/{user_a_id}", json={
        "full_name": "Updated User A",
        "display_name": "updatedUserA",
        "password": "newpasswordA",
        "email": "updatedUserAA@example.com"
    })
    assert response.status_code == 200

def test_user_f_login_user_a():
    response = requests.post(f"{BASE_URL}/users/login", json={
        "email": "updatedUserAA@example.com",
        "password": "newpasswordA"
    })
    assert response.status_code == 200
    global user_a_token
    user_a_token = response.json()["access_token"]

def test_user_g_deactivate_user_b_fail():
    response = requests.post(f"{BASE_URL}/users/{user_b_id}/deactivate", headers={"x-access-token": user_a_token})
    assert response.status_code == 403

def test_user_h_make_user_a_admin():
    response = requests.post(f"{BASE_URL}/users/{user_a_id}/role/admin", headers={"x-access-token": admin_token})
    assert response.status_code == 200

def test_user_i_deactivate_user_b_pass():
    response = requests.post(f"{BASE_URL}/users/{user_b_id}/deactivate", headers={"x-access-token": user_a_token})
    assert response.status_code == 200

def test_user_j_delete_users():
    response = requests.delete(f"{BASE_URL}/users/{user_b_id}", headers={"x-access-token": user_a_token})
    assert response.status_code == 200

    response = requests.delete(f"{BASE_URL}/users/{user_c_id}", headers={"x-access-token": user_a_token})
    assert response.status_code == 200

    response = requests.delete(f"{BASE_URL}/users/{user_a_id}", headers={"x-access-token": user_a_token})
    assert response.status_code == 200
