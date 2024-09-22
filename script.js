const characters = [
    { name: "Galaxia", img: "imagenes/skin1.png", available: false },
    { name: "Zombie Rosa", img: "imagenes/skin2.png", available: false },
    { name: "Renegada Oficial", img: "imagenes/skin3.png", available: false },
    { name: "Mainty", img: "imagenes/skin4.png", available: false },
    { name: "Bruja surfera", img: "imagenes/skin5.png", available: false },
    { name: "Caballero oscuro", img: "imagenes/skin6.png", available: false },
    { name: "Renegada fuegal", img: "imagenes/skin7.png", available: false },
    { name: "Bombardera oscura", img: "imagenes/skin8.png", available: false },
    { name: "Ruby blue", img: "imagenes/skin9.png", available: false },
    { name: "Bendiux", img: "imagenes/skin10.png", available: false },
];

const storeItems = [
    { name: "Galaxia", img: "imagenes/skin1.png", price: 75000, monthly: true, lastAvailable: null },
    { name: "Zombie Rosa", img: "imagenes/skin2.png", price: 65000 },
    { name: "Renegada Oficial", img: "imagenes/skin3.png", price: 150000, monthly: true, lastAvailable: null },
    { name: "Mainty", img: "imagenes/skin4.png", price: 1200 },
    { name: "Bruja surfera", img: "imagenes/skin5.png", price: 1500 },
    { name: "Caballero oscuro", img: "imagenes/skin6.png", price: 30000 },
    { name: "Renegada fuegal", img: "imagenes/skin7.png", price: 1000 },
    { name: "Bombardera oscura", img: "imagenes/skin8.png", price: 800 },
    { name: "Ruby blue", img: "imagenes/skin9.png", price: 1200 },
    { name: "Bendiux", img: "imagenes/skin10.png", price: 1500, availableFrom: new Date(2023, 9, 1), availableTo: new Date(2023, 9, 5) },
];

let pavos = 0;
const pavosCount = document.getElementById("pavosCount");
const characterList = document.getElementById("characterList");
const storeList = document.getElementById("storeList");
const toggleButton = document.getElementById("toggleButton");
const storeButton = document.getElementById("storeButton");
const countdownDisplay = document.getElementById("countdown");
let lastUpdate = localStorage.getItem("lastUpdate") ? new Date(localStorage.getItem("lastUpdate")) : null;
let currentStoreItems = [];
let userData = null;
const usernameDisplay = document.getElementById("usernameDisplay");
const userInfo = document.getElementById("userInfo");
const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");

// Función para obtener las skins de la tienda según la fecha
function getTodayStoreItems() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const rotationItems = storeItems.filter(item => {
        if (item.availableFrom && item.availableTo) {
            return now >= item.availableFrom && now <= item.availableTo;
        }
        return true;
    });
    let selectedItems = rotationItems.slice(dayOfYear % rotationItems.length, (dayOfYear % rotationItems.length) + 3);

    // Verificar skins mensuales
    const galAvailable = !storeItems[0].lastAvailable || new Date(storeItems[0].lastAvailable) < new Date(now.getFullYear(), now.getMonth(), 1);
    const renegadeAvailable = !storeItems[2].lastAvailable || new Date(storeItems[2].lastAvailable) < new Date(now.getFullYear(), now.getMonth(), 1);

    if (galAvailable && renegadeAvailable) {
        const randomMonthly = Math.random() < 0.5 ? storeItems[0] : storeItems[2];
        selectedItems.push(randomMonthly);
        randomMonthly.lastAvailable = now.toISOString();
    } else if (galAvailable) {
        selectedItems.push(storeItems[0]);
        storeItems[0].lastAvailable = now.toISOString();
    } else if (renegadeAvailable) {
        selectedItems.push(storeItems[2]);
        storeItems[2].lastAvailable = now.toISOString();
    }

    return selectedItems.slice(0, 3);
}

// Función para cargar la tienda
function loadStore() {
    if (currentStoreItems.length === 0) {
        currentStoreItems = getTodayStoreItems();
    }

    storeList.innerHTML = "";
    currentStoreItems.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<img src="${item.img}" alt="${item.name}">
                        <span class="character-name">${item.name}</span>
                        <span class="price">${item.price} Pavos</span>
                        <button class="buy-button" onclick="buyItem('${item.name}', ${item.price})">Comprar</button>`;
        storeList.appendChild(li);
    });

    // Comprobar la cuenta atrás solo para la tienda
    checkCountdown();
}

// Función para comprar un item
function buyItem(itemName, itemPrice) {
    if (pavos >= itemPrice) {
        pavos -= itemPrice;
        pavosCount.textContent = pavos;
        alert(`Has comprado ${itemName}!`);
        characters.forEach((character) => {
            if (character.name === itemName) {
                character.available = true;
            }
        });
        saveUserData();
        loadCharacters();
    } else {
        alert("No tienes suficientes pavos para comprar esta skin!");
    }
}

// Función para actualizar la tienda
function updateStore() {
    const now = new Date();
    if (!lastUpdate || now - lastUpdate >= 24 * 60 * 60 * 1000) {
        lastUpdate = now;
        localStorage.setItem("lastUpdate", now);
        currentStoreItems = [];
        loadStore();
    }
}

// Función para comprobar la cuenta atrás solo dentro de la tienda
function checkCountdown() {
    const now = new Date();
    const nextUpdate = new Date();
    nextUpdate.setHours(24, 0, 0, 0);
    const diff = nextUpdate - now;

    if (diff > 0) {
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        countdownDisplay.textContent = `Próxima actualización en ${hours} horas y ${minutes} minutos.`;
        countdownDisplay.style.display = "block";
    } else {
        countdownDisplay.style.display = "none";
    }
}

// Función para cargar los personajes
function loadCharacters() {
    characterList.innerHTML = "";
    characters.forEach((character) => {
        const li = document.createElement("li");
        li.innerHTML = `<img src="${character.img}" alt="${character.name}">
                        <span class="character-name">${character.name}</span>
                        <img src="imagenes/${character.available ? "verified" : "nolatengo"}.png" alt="Estado" class="status-icon">`;
        characterList.appendChild(li);
    });
}

// Guardar datos del usuario en localStorage
function saveUserData() {
    if (userData) {
        userData.pavos = pavos;
        userData.characters = characters;
        const allUsers = JSON.parse(localStorage.getItem("users")) || {};
        allUsers[userData.email] = userData;
        localStorage.setItem("users", JSON.stringify(allUsers));
    }
}

// Eventos para mostrar/ocultar personajes
toggleButton.addEventListener("click", () => {
    const isVisible = characterList.style.display === "block";
    characterList.style.display = isVisible ? "none" : "block";
    toggleButton.textContent = isVisible ? "Mostrar Personajes" : "Ocultar Personajes";
    if (!isVisible) loadCharacters();
});

// Eventos para mostrar/ocultar tienda
storeButton.addEventListener("click", () => {
    const storeSection = storeList.style.display === "block";
    storeList.style.display = storeSection ? "none" : "block";

    if (!storeSection) {
        loadStore();
    } else {
        countdownDisplay.style.display = "none"; // Ocultar el contador al cerrar la tienda
    }
});

// Registro de usuario
registerButton.addEventListener("click", () => {
    const email = prompt("Introduce tu correo electrónico:");
    const password = prompt("Introduce tu contraseña:");
    const username = prompt("Introduce tu nombre de usuario:");
    
    const allUsers = JSON.parse(localStorage.getItem("users")) || {};
    if (allUsers[email]) {
        alert("El correo ya está registrado.");
        return;
    }

    userData = { email, password, username, pavos: 0, characters };
    allUsers[email] = userData;
    
    localStorage.setItem("users", JSON.stringify(allUsers));
    alert("Registro exitoso!");
});

// Inicio de sesión
loginButton.addEventListener("click", () => {
    const email = prompt("Introduce tu correo electrónico:");
    const password = prompt("Introduce tu contraseña:");
    
    const allUsers = JSON.parse(localStorage.getItem("users")) || {};
    const storedData = allUsers[email];

    if (storedData && storedData.password === password) {
        userData = storedData;
        pavos = userData.pavos;
        
        // Asignar skins para el creador de contenido
        if (userData.email === "facilpedro67@gmail.com") {
            characters.forEach(character => {
                if (["Bendiux", "Renegada Oficial", "Galaxia"].includes(character.name)) {
                    character.available = true;
                }
            });
        } else {
            characters.forEach((character) => {
                const found = userData.characters.find(c => c.name === character.name);
                if (found) {
                    character.available = found.available;
                }
            });
        }

        pavosCount.textContent = pavos;
        loadCharacters();
        userInfo.style.display = "flex";

        // Mostrar nombre en rojo y con icono para el creador de contenido
        if (userData.email === "facilpedro67@gmail.com") {
            usernameDisplay.innerHTML = `<span style="color: red; font-weight: bold;">${userData.username}</span> <img src="imagenes/verified.png" alt="Verificado" class="verified-icon" style="width: 20px; height: 20px;">`;
        } else {
            usernameDisplay.textContent = `Nombre de usuario: ${userData.username}`;
        }

        alert("Inicio de sesión exitoso!");
        
        registerButton.style.display = "none";
        loginButton.style.display = "none";
    } else {
        alert("Credenciales incorrectas.");
    }
});

// Cargar datos al iniciar
const storedData = JSON.parse(localStorage.getItem("users"));
if (storedData) {
    const email = prompt("Introduce tu correo electrónico para cargar tu cuenta:");
    const user = storedData[email];
    if (user) {
        userData = user;
        pavos = userData.pavos;
        
        // Asignar skins para el creador de contenido
        if (userData.email === "facilpedro67@gmail.com") {
            characters.forEach(character => {
                if (["Bendiux", "Renegada Oficial", "Galaxia"].includes(character.name)) {
                    character.available = true;
                }
            });
        } else {
            characters.forEach((character) => {
                const found = userData.characters.find(c => c.name === character.name);
                if (found) {
                    character.available = found.available;
                }
            });
        }

        pavosCount.textContent = pavos;
        loadCharacters();
        
        // Mostrar nombre en rojo y con icono para el creador de contenido
        if (userData.email === "facilpedro67@gmail.com") {
            usernameDisplay.innerHTML = `<span style="color: red; font-weight: bold;">${userData.username}</span> <img src="imagenes/verified.png" alt="Verificado" class="verified-icon" style="width: 20px; height: 20px;">`;
        } else {
            usernameDisplay.textContent = `Nombre de usuario: ${userData.username}`;
        }
        
        userInfo.style.display = "flex";
    }
}

updateStore();
setInterval(() => {
    pavos += 20;
    pavosCount.textContent = pavos;
    saveUserData();  // Guardar pavos cada vez que aumenten
}, 60000);
