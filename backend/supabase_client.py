import os

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_secret_key = os.getenv("SUPABASE_SECRET_KEY")

if not supabase_url or not supabase_secret_key:
    raise RuntimeError("Missing Supabase environment variables")

supabase: Client = create_client(
    supabase_url,
    supabase_secret_key,
)
