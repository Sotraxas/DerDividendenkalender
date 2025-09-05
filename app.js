// Firebase SDK initialisieren
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCFkxooDFOAs3CVZzib63Q8cqrwueDhPOM",
  authDomain: "derdividendenkalender.firebaseapp.com",
  projectId: "derdividendenkalender",
  storageBucket: "derdividendenkalender.firebasestorage.app",
  messagingSenderId: "123152654700",
  appId: "1:123152654700:web:7a4ca1e7ed455793b31349",
  measurementId: "G-VWVDBE9YVT"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login-Logik
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, username, password);
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard-container').style.display = 'block';
        loadDividends(); // Alle Dividenden laden
    } catch (error) {
        alert('Fehler beim Anmelden: ' + error.message);
    }
});

// Dividenden laden
async function loadDividends() {
    const querySnapshot = await getDocs(collection(db, "dividenden"));
    const divList = document.getElementById('dividenden-list');
    divList.innerHTML = ''; // Leert die Liste
    querySnapshot.forEach((doc) => {
        const divData = doc.data();
        const divElement = document.createElement('div');
        divElement.textContent = `Aktie: ${divData.aktie}, Dividende: ${divData.dividende}€`;
        divList.appendChild(divElement);
    });
}

// Dividende hinzufügen
async function addDividend() {
    const aktie = prompt('Gib die Aktie ein:');
    const dividende = parseFloat(prompt('Gib die Dividende ein:'));
    
    if (aktie && !isNaN(dividende)) {
        try {
            await addDoc(collection(db, "dividenden"), {
                aktie: aktie,
                dividende: dividende,
                datum: new Date()
            });
            loadDividends(); // Nach dem Hinzufügen die Liste neu laden
        } catch (error) {
            alert('Fehler beim Hinzufügen der Dividende: ' + error.message);
        }
    } else {
        alert('Bitte gültige Daten eingeben!');
    }
}

// Logout
function logout() {
    signOut(auth).then(() => {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('dashboard-container').style.display = 'none';
    }).catch((error) => {
        alert('Fehler beim Abmelden: ' + error.message);
    });
}