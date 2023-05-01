from app import app

def test_valid_login():
    client = app.test_client()
    response = client.post('/login', data={'username': 'user1', 'password': 'password1'})
    assert response.status_code == 200
    assert b'Welcome, user1!' in response.data

def test_invalid_login():
    client = app.test_client()
    response = client.post('/login', data={'username': 'user1', 'password': 'invalid_password'})
    assert response.status_code == 401
    assert b'Invalid username or password' in response.data