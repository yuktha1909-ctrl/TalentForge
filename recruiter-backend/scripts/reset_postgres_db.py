import psycopg2

def reset_postgres():
    conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/recruiter_db")
    conn.autocommit = True
    cur = conn.cursor()
    print("Dropping PostgreSQL public schema...")
    cur.execute("DROP SCHEMA public CASCADE;")
    cur.execute("CREATE SCHEMA public;")
    cur.close()
    conn.close()
    print("PostgreSQL public schema reset successfully!")

if __name__ == "__main__":
    reset_postgres()
