"""Diagnostic: print the state of GITHUB_APP_PRIVATE_KEY after .env loading.

Run from backend/ folder with the venv active:
    python check_key.py
"""
from dotenv import load_dotenv
import os

load_dotenv()
raw = os.environ.get("GITHUB_APP_PRIVATE_KEY", "")
normalized = raw.replace("\\n", "\n")

print("=" * 60)
print(f"Raw length:           {len(raw)}")
print(f"Normalized length:    {len(normalized)}")
print(f"Has \\n escapes:       {'\\n' in raw}")
print(f"Has actual newlines:  {chr(10) in raw}")
print(f"Starts correctly:     {normalized.startswith('-----BEGIN')}")
print(f"Ends correctly:       {normalized.rstrip().endswith('PRIVATE KEY-----')}")
print(f"Line count:           {len(normalized.splitlines())}")
print("-" * 60)
print("First line:", repr(normalized.splitlines()[0]) if normalized else "EMPTY")
print("Last line: ", repr(normalized.splitlines()[-1]) if normalized else "EMPTY")
print("=" * 60)

print("\nAttempting to load with cryptography...")
try:
    from cryptography.hazmat.primitives.serialization import load_pem_private_key
    key = load_pem_private_key(normalized.encode(), password=None)
    print(f"✅ Key loaded successfully — type: {type(key).__name__}")
except Exception as e:
    print(f"❌ Failed: {type(e).__name__}: {e}")
