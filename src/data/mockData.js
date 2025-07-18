export const mockPatients = [
  {
    id: "PATIENT1",
    name: "Max Mustermann",
    birthdate: "1990-01-01",
    address: "Musterstraße 1, 12345 Musterstadt",
    insurance: "AOK",
    history: "No pre-existing conditions.",
    records: [],
    changelog: []
  }
];

export const mockUploads = [
  {
    id: "1",
    title: "Blood Test.pdf",
    patientId: "PATIENT1",
    patientName: "Max Mustermann",
    birthdate: "1990-01-01",
    type: "Lab",
    summary: "Leukocytes elevated, hemoglobin normal.",
    fullText: "Leukocytes: 12,000/µl, Hemoglobin: 14 g/dl, ...",
    status: "pending",
    date: "2025-07-15"
  }
];
