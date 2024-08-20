import requests

BASE_URL = "http://localhost:8001"

def test_book_review_a_preprocessing():
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

    global book_id_1, book_id_2
    response = requests.post(f"{BASE_URL}/books/", json={
        "title": "Test Book",
        "author": "Test Author",
        "genre": "Test Genre",
        "year_published": 2024,
        "summary": "Test Summary",
        "book_url": "http://example.com/test_book_review_book"
    }, headers={"x-access-token": admin_token})
    assert response.status_code == 200
    book_id_1 = response.json()["id"]
    response = requests.post(f"{BASE_URL}/books/", json={
        "title": "Test Book",
        "author": "Test Author",
        "genre": "Test Genre",
        "year_published": 2024,
        "summary": "Test Summary",
        "book_url": "http://example.com/test_book_review_book"
    }, headers={"x-access-token": admin_token})
    assert response.status_code == 200
    book_id_2 = response.json()["id"]

def test_book_review_b_create_review():
    response = requests.post(f"{BASE_URL}/reviews/", json={
        "book_id": book_id_1,
        "review_text": "First review",
        "rating": 5
    }, headers={"x-access-token": user_a_token})
    assert response.status_code == 200
    global first_review_id
    first_review_id = response.json()["id"]

def test_book_review_c_create_another_review():
    response = requests.post(f"{BASE_URL}/reviews/", json={
        "book_id": book_id_2,
        "review_text": "Second review",
        "rating": 4
    }, headers={"x-access-token": user_a_token})
    assert response.status_code == 200
    global second_review_id
    second_review_id = response.json()["id"]

def test_book_review_d_get_reviews_by_user():
    response = requests.get(f"{BASE_URL}/reviews/user/{user_a_id}", headers={"x-access-token": user_a_token})
    assert response.status_code == 200

def test_book_review_e_get_reviews_by_book():
    response = requests.get(f"{BASE_URL}/reviews/book/{book_id_1}", headers={"x-access-token": user_a_token})
    assert response.status_code == 200

def test_book_review_f_update_review_fail():
    response = requests.put(f"{BASE_URL}/reviews/{first_review_id}", json={
        "review_text": "Updated review text",
        "rating": 3
    }, headers={"x-access-token": admin_token})
    print(response.text)
    assert response.status_code == 403

def test_book_review_g_update_review_success():
    response = requests.put(f"{BASE_URL}/reviews/{first_review_id}", json={
        "review_text": "Updated review text",
        "rating": 3
    }, headers={"x-access-token": user_a_token})
    assert response.status_code == 200

def test_book_review_h_delete_first_review():
    response = requests.delete(f"{BASE_URL}/reviews/{first_review_id}", headers={"x-access-token": user_a_token})
    assert response.status_code == 200

def test_book_review_i_delete_second_review():
    response = requests.delete(f"{BASE_URL}/reviews/{second_review_id}", headers={"x-access-token": admin_token})
    assert response.status_code == 200

def test_book_review_j_delete_book_and_user():
    response = requests.delete(f"{BASE_URL}/books/{book_id_1}", headers={"x-access-token": admin_token})
    assert response.status_code == 200

    response = requests.delete(f"{BASE_URL}/books/{book_id_2}", headers={"x-access-token": admin_token})
    assert response.status_code == 200

    response = requests.delete(f"{BASE_URL}/users/{user_a_id}", headers={"x-access-token": admin_token})
    assert response.status_code == 200
