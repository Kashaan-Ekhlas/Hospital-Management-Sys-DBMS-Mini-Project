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

@router.put("/{id}")
def update_doctor(id: int, name: str, specialization: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE doctors SET name=%s, specialization=%s WHERE id=%s", (name, specialization, id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"msg": "updated"}

@router.delete("/{id}")
def delete_doctor(id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM doctors WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"msg": "deleted"}