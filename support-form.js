// Sends the web "Report a Bug or Contact Support" form to the SAME Firestore
// collection and field names the iOS and Android apps write to:
// /bug_reports — subject, description, userEmail, uid, timestamp, status.
// See FirestoreBugReportService.swift (iOS) and FirebaseManager.kt (Android).
// Reports submitted here show up in the same Admin Bug Reports screen as
// in-app reports.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Same Firebase project as the app (wealthboard-18bfb / GoogleService-Info.plist).
// TODO: replace appId with the Web app's own App ID — Firebase console →
// Project settings → Your apps → Add app → Web (</>) → register
// "WealthBoard Website" → copy the config it gives you and paste the whole
// object here. The apiKey/projectId below are already correct; only appId
// is a placeholder borrowed from the iOS app.
const firebaseConfig = {
  apiKey: "AIzaSyA7LUy_VCBsGBCRvVe8rCrmq2pWKTKmPT8",
  authDomain: "wealthboard-18bfb.firebaseapp.com",
  projectId: "wealthboard-18bfb",
  storageBucket: "wealthboard-18bfb.firebasestorage.app",
  messagingSenderId: "336382017055",
  appId: "1:336382017055:web:419cad4f21c430c4ee1f2a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("support-form");
  if (!form) return;

  const status = document.getElementById("support-form-status");
  const defaultMsg = status.textContent;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = form.querySelector("button");
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    btn.disabled = true;
    btn.textContent = "Sending…";

    addDoc(collection(db, "bug_reports"), {
      subject: subject,
      description: message,
      userEmail: email,
      uid: "web",
      timestamp: serverTimestamp(),
      status: "open"
    })
      .then(function () {
        form.reset();
        status.textContent = "Thanks — your report was sent. We aim to reply within 48 hours.";
        status.className = "form-status success";
      })
      .catch(function (err) {
        console.error("bug_reports submit failed:", err);
        status.textContent = "Something went wrong sending this. Please try again, or use the in-app Contact Support option.";
        status.className = "form-status error";
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = "Submit Report";
        setTimeout(function () {
          status.textContent = defaultMsg;
          status.className = "form-status";
        }, 6000);
      });
  });
});
