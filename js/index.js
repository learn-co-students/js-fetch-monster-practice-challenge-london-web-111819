// GLOBAL VARIABLES / COBSTANTS
const baseURI = 'http://localhost:3000/monsters'
const monsterContainer = document.querySelector('#monster-container')
const createMonsterForm = document.querySelector('#create-monster')

// API FUNCTIONS
function get(url) {
    return fetch(url)
    .then(response => response.json())
}

function post(url, bodyObject) {
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }, 
        body: JSON.stringify(bodyObject)
    })
    .then(response => response.json())
}

// FUNCTIONS
function createMonsterListItem(monster) {
    let div = document.createElement('div')
    let name = document.createElement('h1')
    name.textContent = monster.name
    let age = document.createElement('p')
    age.textContent = monster.age
    let description = document.createElement('p')
    description.textContent = monster.description
    div.append(name, age, description)
    monsterContainer.appendChild(div)
}

function getMonstersThenRender() {
    get(baseURI)
    .then(monsters => {
        let fiftyMonsters = monsters.slice(Math.max(monsters.length - 50, 1)).reverse()
        fiftyMonsters.forEach(createMonsterListItem)
    })
}

function createNewMonsterAndRender(event) {
    post(baseURI, {
        name: event.target.name.value,
        age: event.target.age.value,
        description: event.target.description.value
    })
    .then(createMonsterListItem)
}

// EVENT LISTENERS
document.body.onload = getMonstersThenRender
createMonsterForm.addEventListener('submit', createNewMonsterAndRender)