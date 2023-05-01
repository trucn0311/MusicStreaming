from app import app

def test_valid_registration():
    client = app.test_client()
    response = client.post('/register', data={'username': 'user2', 'password': 'password2', 'confirm_password': 'password2'})
    assert response.status_code == 200
    assert b'Welcome, user2!' in response.data

def test_invalid_registration():
    client = app.test_client()
    response = client.post('/register', data={'username': 'user1', 'password': 'password1', 'confirm_password': 'password1'})
    assert response.status_code == 400
    assert b'Username already taken' in response.data