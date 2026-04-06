const API = "http://127.0.0.1:8000";

async function addPatient() {
  const name = document.getElementById("pname").value;
  const age = document.getElementById("page").value;
  const gender = document.getElementById("pgender").value;

  await fetch(`${API}/patients/?name=${name}&age=${age}&gender=${gender}`, {
    method: "POST"
  });

  loadPatients();
}

async function loadPatients() {
  const res = await fetch(`${API}/patients/`);
  const data = await res.json();

  const list = document.getElementById("patients");
  list.innerHTML = "";

  data.forEach(p => {
    const li = document.createElement("li");
    li.innerText = `${p.name} (${p.age})`;

    const del = document.createElement("button");
    del.innerText = "Delete";
    del.onclick = async () => {
      await fetch(`${API}/patients/${p.id}`, { method: "DELETE" });
      loadPatients();
    };

    li.appendChild(del);
    list.appendChild(li);
  });
}