from fastapi import FastAPI
from db.init_db import init_db
from routes import patients, doctors, appointments
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(patients.router, prefix="/patients")
app.include_router(doctors.router, prefix="/doctors")
app.include_router(appointments.router, prefix="/appointments")