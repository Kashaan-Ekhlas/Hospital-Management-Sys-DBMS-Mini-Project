from fastapi import APIRouter
from db.connection import get_db

router = APIRouter()

@router.get("/")
def get_doctors():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM doctors")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data

@router.post("/")
def add_doctor(name: str, specialization: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO doctors (name, specialization) VALUES (%s,%s)", (name, specialization))
    conn.commit()
    cursor.close()
    conn.close()
    return {"msg": "added"}