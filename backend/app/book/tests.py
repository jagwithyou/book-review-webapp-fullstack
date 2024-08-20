import requests

BASE_URL = "http://localhost:8001"

def test_book_a_preprocessing():
    #Get admin ntoken
    global admin_token
    response = requests.post(f"{BASE_URL}/users/login", json={
        "email": "admin@example.com",
        "password": "adminpassword"
    })
    assert response.status_code == 200
    admin_token = response.json()["access_token"]
    #Create user A and get token
    response = requests.post(f"{BASE_URL}/users/", json={
        "full_name": "User A",
        "display_name": "userA",
        "password": "passwordA",
        "email": "userA@example.com"
    })
    assert response.status_code == 200
    global user_a_id
    user_a_id = response.json()["id"]
    response = requests.post(f"{BASE_URL}/users/login", json={
        "email": "userA@example.com",
        "password": "passwordA"
    })
    assert response.status_code == 200
    global user_a_token
    user_a_token = response.json()["access_token"]

    global book_id
    response = requests.post(f"{BASE_URL}/books/", json={
        "title": "Initial Book",
        "author": "Initial Author",
        "genre": "Initial Genre",
        "year_published": 2024,
        "summary": "Initial Summary",
        "book_url": "http://example.com/initial_book"
    }, headers={"x-access-token": admin_token})
    assert response.status_code == 200
    book_id = response.json()["id"]

def test_book_b_create_book_fail():
    response = requests.post(f"{BASE_URL}/books/", json={
        "title": "Book by User A",
        "author": "Author A",
        "genre": "Genre A",
        "year_published": 2024,
        "summary": "Summary by User A",
        "book_url": "http://example.com/book_by_userA"
    }, headers={"x-access-token": user_a_token})
    assert response.status_code == 403

def test_book_c_get_books():
    response = requests.get(f"{BASE_URL}/books/", headers={"x-access-token": user_a_token})
    assert response.status_code == 200

def test_book_d_get_book():
    response = requests.get(f"{BASE_URL}/books/{book_id}", headers={"x-access-token": user_a_token})
    assert response.status_code == 200

def test_book_e_create_book_success():
    response = requests.post(f"{BASE_URL}/books/", json={
        "title": "Book by Admin",
        "author": "Author Admin",
        "genre": "Genre Admin",
        "year_published": 2024,
        "summary": "Summary by Admin",
        "book_url": "http://example.com/book_by_admin"
    }, headers={"x-access-token": admin_token})
    assert response.status_code == 200
    global new_book_id
    new_book_id = response.json()["id"]

def test_book_f_update_book_fail():
    response = requests.put(f"{BASE_URL}/books/{new_book_id}", json={
        "title": "Updated Book by User A",
        "author": "Updated Author A",
        "genre": "Updated Genre A",
        "year_published": 2025,
        "summary": "Updated Summary by User A",
        "book_url": "http://example.com/updated_book_by_userA"
    }, headers={"x-access-token": user_a_token})
    assert response.status_code == 403

def test_book_g_update_book_success():
    response = requests.put(f"{BASE_URL}/books/{new_book_id}", json={
        "title": "Updated Book by Admin",
        "author": "Updated Author Admin",
        "genre": "Updated Genre Admin",
        "year_published": 2025,
        "summary": "Updated Summary by Admin",
        "book_url": "http://example.com/updated_book_by_admin"
    }, headers={"x-access-token": admin_token})
    assert response.status_code == 200

def test_book_h_delete_book_fail():
    response = requests.delete(f"{BASE_URL}/books/{new_book_id}", headers={"x-access-token": user_a_token})
    assert response.status_code == 403

def test_book_i_delete_book_success():
    response = requests.delete(f"{BASE_URL}/books/{new_book_id}", headers={"x-access-token": admin_token})
    assert response.status_code == 200

def test_book_j_delete_user():
    response = requests.delete(f"{BASE_URL}/users/{user_a_id}", headers={"x-access-token": admin_token})
    assert response.status_code == 200
