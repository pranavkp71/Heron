from app.database import db_connection


def signup_user(email: str, password: str) -> dict:
    from app.utils.security import hash_password

    with db_connection() as conn:
        cursor = conn.cursor()
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
    from app.utils.security import verify_password, create_access_token

    with db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, hashed_password FROM users WHERE email = %s",
            (email,)
        )
        user = cursor.fetchone()

    if not user or not verify_password(password, user[1]):
        raise ValueError("Invalid credentials")

    return create_access_token({"sub": str(user[0])})

