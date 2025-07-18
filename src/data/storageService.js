// src/data/storageService.js
import { mockPatients, mockUploads } from "./mockData";

const LS_UPLOADS_KEY = "medical_uploads";
const LS_PATIENTS_KEY = "medical_patients";

export function loadPatients() {
  const saved = localStorage.getItem(LS_PATIENTS_KEY);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(LS_PATIENTS_KEY, JSON.stringify(mockPatients));
  return mockPatients;
}

export function savePatients(patients) {
  localStorage.setItem(LS_PATIENTS_KEY, JSON.stringify(patients));
}

export function loadUploads() {
  const saved = localStorage.getItem(LS_UPLOADS_KEY);
  console.log("Loading uploads from localStorage:", saved);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(LS_UPLOADS_KEY, JSON.stringify(mockUploads));
  return mockUploads;
}

export function saveUploads(uploads) {
  localStorage.setItem(LS_UPLOADS_KEY, JSON.stringify(uploads));
}

export async function loadPatientsAPI() {
  return await fetch("/api/patients").then(res => res.json());
}

export function initializeLocalStorageIfEmpty() {
  localStorage.clear();
  if (!localStorage.getItem(LS_PATIENTS_KEY)) {
    localStorage.setItem(LS_PATIENTS_KEY, JSON.stringify(mockPatients));
  }
  if (!localStorage.getItem(LS_UPLOADS_KEY)) {
    localStorage.setItem(LS_UPLOADS_KEY, JSON.stringify(mockUploads));
  }
}