from app.database import get_connection
from app.utils.security import hash_password, verify_password, create_access_token


def signup_user(email: str, password: str) -> dict:
    conn = get_connection()
    cursor = conn.cursor()

    # Check if email already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        raise ValueError("Email already registered")

    hashed = hash_password(password)

    cursor.execute(
        """
        INSERT INTO users (email, hashed_password)
        VALUES (%s, %s)
        RETURNING id, email, created_at
        """,
        (email, hashed)
    )

    user = cursor.fetchone()
    conn.commit()

    return {"id": user[0], "email": user[1], "created_at": user[2]}


def login_user(email: str, password: str) -> str:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, hashed_password FROM users WHERE email = %s",
        (email,)
    )
    user = cursor.fetchone()

    if not user or not verify_password(password, user[1]):
        raise ValueError("Invalid credentials")

    token = create_access_token({"sub": str(user[0])})
    return token
