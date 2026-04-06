from fastapi import APIRouter
from db.connection import get_db

router = APIRouter()

@router.get("/")
def get_patients():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM patients")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data

@router.post("/")
def add_patient(name: str, age: int, gender: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO patients (name, age, gender) VALUES (%s,%s,%s)", (name, age, gender))
    conn.commit()
    cursor.close()
    conn.close()
    return {"msg": "added"}

@router.put("/{id}")
def update_patient(id: int, name: str, age: int, gender: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE patients SET name=%s, age=%s, gender=%s WHERE id=%s",
                   (name, age, gender, id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"msg": "updated"}

@router.delete("/{id}")
def delete_patient(id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM patients WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"msg": "deleted"}