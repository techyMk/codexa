"""Demo file with intentional bugs — copy this into a test PR to see Codexa flag real issues.

Codexa should catch:
  - SQL injection (unsanitized f-string into query)
  - Hardcoded secret
  - Division-by-zero risk
  - Missing input validation
  - Bare except hiding errors
  - Mutable default argument
"""

import sqlite3

API_KEY = "sk-prod-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c"   # hardcoded secret


def get_user(db: sqlite3.Connection, username: str):
    cursor = db.cursor()
    cursor.execute(f"SELECT * FROM users WHERE username = '{username}'")  # SQL injection
    return cursor.fetchone()


def average(numbers):
    return sum(numbers) / len(numbers)                  # ZeroDivisionError if empty


def parse_age(raw: str) -> int:
    return int(raw)                                     # crashes on non-numeric input


def fetch_user_orders(user_id, orders=[]):              # mutable default arg
    orders.append(user_id)
    return orders


def divide(a, b):
    try:
        return a / b
    except:                                             # bare except swallows everything
        return None
