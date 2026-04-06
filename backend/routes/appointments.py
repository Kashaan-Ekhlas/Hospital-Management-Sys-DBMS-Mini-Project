from fastapi import APIRouter
from db.connection import get_db

router = APIRouter()

@router.get("/")
def get_appointments():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
    SELECT a.id, p.name as patient, d.name as doctor, a.date
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN doctors d ON a.doctor_id = d.id
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data

@router.post("/")
def add_appointment(patient_id: int, doctor_id: int, date: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO appointments (patient_id, doctor_id, date) VALUES (%s,%s,%s)",
        (patient_id, doctor_id, date)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"msg": "added"}