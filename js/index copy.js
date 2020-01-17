// document.addEventListener('DOMContentLoaded', function(){

//HELPER APIS
function post(URI,newObj){
    let configObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(newObj)
      };
    return fetch(URI, configObj).then(response=>response.json())
}

function get(URI) {
    return fetch(URI).then(response=>response.json())
}

//CONSTANTS, INITIAL LETS
let createMonsterDiv = document.getElementById('create-monster')
const BASE_MONSTER_URI = "http://localhost:3000/monsters/"
const divMonsterContainer = document.getElementById('monster-container')
let forwardButton = document.getElementById('forward')
let backButton = document.getElementById('back')
let currentPage = 1
let batchSize = 3
//START FROM HERE

//FUNCTIONS
function createNewMonsterFormWithAnEventListener(){
    let newMonsterForm = document.createElement('form')
    newMonsterForm.id = 'monster-form'
    let newName = document.createElement('input')
    newName.id = 'name'
    newName.placeholder = 'name...'
    let newAge = document.createElement('input')
    newAge.id = 'age'
    newAge.placeholder = 'age...'
    let newDescription = document.createElement('input')
    newDescription.id = 'description'
    newDescription.placeholder = 'description...'    
    let newCreateButton = document.createElement('button')
    newCreateButton.innerText = 'Create'
    newMonsterForm.append(newName,newAge,newDescription,newCreateButton)
    newMonsterForm.addEventListener("submit",postMonster)
    createMonsterDiv.appendChild(newMonsterForm)
}

function postMonster(event){
    event.preventDefault()
    let nameEntered = document.getElementById('name').value
    let ageEntered = document. getElementById('age').value
    let descriptionEntered = document.getElementById('description').value
    let objectToPost = {
        name: nameEntered,
        age: ageEntered,
        description: descriptionEntered
    }
    post(BASE_MONSTER_URI,objectToPost).then(console.log("monster created"))
}

function populateTheFirst50Monsters(){
    getMeMonstersBasedOnLimitAndPageAndRenderThemOnPage(3,currentPage)
}

function renderMonsterToPage(monster){
    let newDiv = document.createElement('div')
    let newH2 = document.createElement('h2')
    newH2.innerText =  `${monster.name} ${monster.id}`
    let newH4 = document.createElement('h4')
    newH4.innerText = monster.age
    let newP = document.createElement('p')
    newP.innerText = monster.description
    newDiv.append(newH2,newH4,newP)
    divMonsterContainer.appendChild(newDiv)
}

const getMeMonstersBasedOnLimitAndPageAndRenderThemOnPage = (limit,page) => {
// function getMeMonstersBasedOnLimitAndPageAndRenderThemOnPage(limit,page){
    // http://localhost:3000/monsters/?_limit=3&_page=2
    urlToSend = `${BASE_MONSTER_URI}?_limit=${limit}&_page=${page}`
    console.log(urlToSend)
    get(urlToSend).then(object=>object.forEach(renderMonsterToPage))
}

const getTheNext50Items = () => {
// function getTheNext50Items(){
    divMonsterContainer.innerHTML =''
    getMeMonstersBasedOnLimitAndPageAndRenderThemOnPage(batchSize,currentPage+1)
        currentPage +=1
}

function getThePrevious50Items(){
    divMonsterContainer.innerHTML =''
    getMeMonstersBasedOnLimitAndPageAndRenderThemOnPage(batchSize,currentPage-1)
    if (currentPage === 1) {
    } else {
        currentPage -=1
    }
}


//INITIAL LOADERS, UNRELATED EVENT LISTENERS
document.body.onload = createNewMonsterFormWithAnEventListener
// createNewMonsterFormWithAnEventListener()
populateTheFirst50Monsters()
forwardButton.addEventListener("click",getTheNext50Items)
backButton.addEventListener("click",getThePrevious50Items)

// })