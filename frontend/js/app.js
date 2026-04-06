const API = "http://127.0.0.1:8000";

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 3000);
}

// ------ PATIENTS ------
async function loadPatients() {
  const res = await fetch(`${API}/patients/`);
  const data = await res.json();
  const tbody = document.getElementById("patients-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  data.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>${p.gender}</td>
      <td class="action-buttons">
        <button class="edit" onclick="editPatient(${p.id}, '${p.name}', ${p.age}, '${p.gender}')">Edit</button>
        <button class="delete" onclick="deletePatient(${p.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function savePatient() {
  const idValue = document.getElementById("pid").value;
  const name = document.getElementById("pname").value.trim();
  const age = document.getElementById("page").value.trim();
  const gender = document.getElementById("pgender").value;

  if (!name || !age || !gender) {
    alert("Empty entries not allowed");
    return;
  }

  if (idValue) {
    // Update
    await fetch(`${API}/patients/${idValue}?name=${name}&age=${age}&gender=${gender}`, { method: "PUT" });
    showToast("Patient Updated!");
  } else {
    // Add
    await fetch(`${API}/patients/?name=${name}&age=${age}&gender=${gender}`, { method: "POST" });
    showToast("Patient Added!");
  }

  document.getElementById("pid").value = "";
  document.getElementById("pname").value = "";
  document.getElementById("page").value = "";
  document.getElementById("pgender").value = "";
  document.getElementById("p-submit-btn").innerText = "Add Patient";
  loadPatients();
}

function editPatient(id, name, age, gender) {
  document.getElementById("pid").value = id;
  document.getElementById("pname").value = name;
  document.getElementById("page").value = age;
  document.getElementById("pgender").value = gender;
  document.getElementById("p-submit-btn").innerText = "Update Patient";
}

async function deletePatient(id) {
  if (confirm("Delete this patient?")) {
    await fetch(`${API}/patients/${id}`, { method: "DELETE" });
    showToast("Patient Deleted!");
    loadPatients();
  }
}

// ------ DOCTORS ------
async function loadDoctors() {
  const res = await fetch(`${API}/doctors/`);
  const data = await res.json();
  const tbody = document.getElementById("doctors-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  data.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.id}</td>
      <td>${d.name}</td>
      <td>${d.specialization}</td>
      <td class="action-buttons">
        <button class="edit" onclick="editDoctor(${d.id}, '${d.name}', '${d.specialization}')">Edit</button>
        <button class="delete" onclick="deleteDoctor(${d.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function saveDoctor() {
  const idValue = document.getElementById("did").value;
  const name = document.getElementById("dname").value.trim();
  const spec = document.getElementById("dspec").value.trim();

  if (!name || !spec) {
    alert("Empty entries not allowed");
    return;
  }

  if (idValue) {
    // Update
    await fetch(`${API}/doctors/${idValue}?name=${name}&specialization=${spec}`, { method: "PUT" });
    showToast("Doctor Updated!");
  } else {
    // Add
    await fetch(`${API}/doctors/?name=${name}&specialization=${spec}`, { method: "POST" });
    showToast("Doctor Added!");
  }

  document.getElementById("did").value = "";
  document.getElementById("dname").value = "";
  document.getElementById("dspec").value = "";
  document.getElementById("d-submit-btn").innerText = "Add Doctor";
  loadDoctors();
}

function editDoctor(id, name, spec) {
  document.getElementById("did").value = id;
  document.getElementById("dname").value = name;
  document.getElementById("dspec").value = spec;
  document.getElementById("d-submit-btn").innerText = "Update Doctor";
}

async function deleteDoctor(id) {
  if (confirm("Delete this doctor?")) {
    await fetch(`${API}/doctors/${id}`, { method: "DELETE" });
    showToast("Doctor Deleted!");
    loadDoctors();
  }
}

// ------ APPOINTMENTS ------
async function loadAppointments() {
  const res = await fetch(`${API}/appointments/`);
  const data = await res.json();
  const tbody = document.getElementById("appointments-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  data.forEach(a => {
    let displayDate = a.date;
    if (a.date && a.date.includes("-")) {
      const parts = a.date.split("-");
      if (parts.length === 3) {
        displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.id}</td>
      <td>${a.patient}</td>
      <td>${a.doctor}</td>
      <td>${displayDate}</td>
      <td class="action-buttons">
        <button class="edit" onclick="editAppointment(${a.id}, '${a.patient}', '${a.doctor}', '${a.date}')">Edit</button>
        <button class="delete" onclick="deleteAppointment(${a.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function populateDropdowns() {
  const pSelect = document.getElementById("apatient");
  const dSelect = document.getElementById("adoctor");
  if (!pSelect || !dSelect) return;

  const [pRes, dRes] = await Promise.all([
    fetch(`${API}/patients/`),
    fetch(`${API}/doctors/`)
  ]);
  
  const patients = await pRes.json();
  const doctors = await dRes.json();
  
  pSelect.innerHTML = "<option value=''>Select Patient</option>";
  patients.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.innerText = `${p.name} (ID: ${p.id})`;
    pSelect.appendChild(opt);
  });

  dSelect.innerHTML = "<option value=''>Select Doctor</option>";
  doctors.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.innerText = `${d.name} (ID: ${d.id})`;
    dSelect.appendChild(opt);
  });
}

async function saveAppointment() {
  const aid = document.getElementById("aid").value;
  const pid = document.getElementById("apatient").value;
  const did = document.getElementById("adoctor").value;
  let dateField = document.getElementById("adate-display");
  const rawDate = dateField ? dateField.value.trim() : "";
  
  let date = rawDate;
  if (rawDate.includes('/')) {
    const parts = rawDate.split('/');
    if (parts.length === 3) date = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  if (!pid || !did || !date) {
    alert("Empty entries not allowed");
    return;
  }

  if (aid) {
    await fetch(`${API}/appointments/${aid}?patient_id=${pid}&doctor_id=${did}&date=${date}`, { method: "PUT" });
    showToast("Appointment Updated!");
  } else {
    await fetch(`${API}/appointments/?patient_id=${pid}&doctor_id=${did}&date=${date}`, { method: "POST" });
    showToast("Appointment Added!");
  }

  document.getElementById("aid").value = "";
  document.getElementById("apatient").value = "";
  document.getElementById("adoctor").value = "";
  if(document.getElementById("adate")) document.getElementById("adate").value = "";
  if(dateField) dateField.value = "";
  let btn = document.getElementById("a-submit-btn");
  if(btn) btn.innerText = "Add Appointment";
  loadAppointments();
}

function editAppointment(id, pName, dName, dateStr) {
  document.getElementById("aid").value = id;
  if(document.getElementById("adate")) document.getElementById("adate").value = dateStr;
  updateDateDisplay(dateStr);
  
  const pSelect = document.getElementById("apatient");
  if (pSelect) {
    for (let opt of pSelect.options) {
      if (opt.text.startsWith(pName + " (ID:")) {
        pSelect.value = opt.value;
        break;
      }
    }
  }

  const dSelect = document.getElementById("adoctor");
  if (dSelect) {
    for (let opt of dSelect.options) {
      if (opt.text.startsWith(dName + " (ID:")) {
        dSelect.value = opt.value;
        break;
      }
    }
  }
  
  let btn = document.getElementById("a-submit-btn");
  if(btn) btn.innerText = "Update Appointment";
}

async function deleteAppointment(id) {
  if (confirm("Delete this appointment?")) {
    await fetch(`${API}/appointments/${id}`, { method: "DELETE" });
    showToast("Appointment Deleted!");
    loadAppointments();
  }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  if(document.getElementById("patients-body")) loadPatients();
  if(document.getElementById("doctors-body")) loadDoctors();
  if(document.getElementById("appointments-body")) {
    loadAppointments();
    populateDropdowns();
  }
});

function updateDateDisplay(val) {
  if (val) {
    const parts = val.split('-');
    if (parts.length === 3) {
      document.getElementById('adate-display').value = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  } else {
    document.getElementById('adate-display').value = '';
  }
}