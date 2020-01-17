// HELPER APIS
function get(URI) {
    return fetch(URI).then(response=>response.json())
}

function destroy(URI,id){
    let configObj = {
        method: "DELETE"
    }
    return fetch(`${URI}/${id}`,configObj).then(response=>response.json())
}

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

function patch(URI,id,patchObj){
    let patchData = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        body: JSON.stringify(patchObj)
        };
        return fetch(`${URI}${id}`,patchData).then(response=>response.json())
}

//CONSTANTS
const batchSize = 2
const BASE_MONSTER_URL = "http://localhost:3000/monsters/"
const CREATE_MONSTER_DIV = document.getElementById('create-monster')
const MONSTER_CONTAINER = document.getElementById('monster-container')
let currentPage = 1
const forwardButton = document.getElementById('forward')
const backButton = document.getElementById('back')


//FUNCTIONS
function createNewMonsterFormAndPopulateInitialBatchOfMonsters(){
    //http://localhost:3000/monsters/?_limit=20&_page=3
    putAddMonsterFormOnPage()
    getMonstersForLimitAndPage(batchSize,currentPage)
}

function putAddMonsterFormOnPage(){
    let addNewMonsterForm = document.createElement('form')
    let newName = document.createElement('input')
    newName.placeholder = 'name...'
    newName.id = 'name'
    let newAge = document.createElement('input')
    newAge.id = 'age'
    newAge.placeholder = 'age...'
    let newDescription = document.createElement('input')
    newDescription.id = 'description'
    newDescription.placeholder = 'description...'
    let newButton = document.createElement('button')
    newButton.innerText = 'Create'
    addNewMonsterForm.append(newName,newAge,newDescription,newButton)
    addNewMonsterForm.addEventListener("submit",postNewMonster)
    CREATE_MONSTER_DIV.appendChild(addNewMonsterForm)
}

function postNewMonster(event){
    let nameEntered = document.getElementById('name').value
    let ageEntered = document.getElementById('age').value
    let descriptionEntered = document.getElementById('description').value
    let newMonsterObject = {
        name: nameEntered,
        age: ageEntered,
        description: descriptionEntered
    }
    post(BASE_MONSTER_URL,newMonsterObject)
}

function getMonstersForLimitAndPage(limit,page) {
    urlToSend = `${BASE_MONSTER_URL}?_limit=${limit}&_page=${page}`
    get(urlToSend).then(renderMonstersOnPage)
}

function renderMonstersOnPage(monsters) {
    MONSTER_CONTAINER.innerHTML = ''
    monsters.forEach(renderOneMonster)
}

function renderOneMonster(monster) {
    let newDiv = document.createElement('div')
    let newH2 = document.createElement('h2')
    newH2.innerText = `${monster.id} - ${monster.name}`
    let newH4 = document.createElement('h4')
    newH4.innerText = monster.age
    let newP = document.createElement('p')
    newP.innerText = monster.description
    newDeleteButton = document.createElement('button')
    newDeleteButton.innerText = 'Delete this monster!'
    newDeleteButton.addEventListener("click",()=>deleteMonsterAndAlertThatItIsDeleted(monster,newDiv))
    let newEditButton = document.createElement('button')
    newEditButton.innerText = 'Edit this monster!'
    newEditButton.addEventListener("click",()=>editThisMonster(newDiv,monster,newH2,newH4,newP))
    newDiv.append(newH2,newH4,newP,newDeleteButton,newEditButton)
    MONSTER_CONTAINER.appendChild(newDiv)
}

function editThisMonster(originalDiv,monster,newH2,newH4,newP) {
    //Serve the form with the current data and be ready for the edit event
    let EditMonsterForm = document.createElement('form')
    let currentName = document.createElement('input')
    currentName.value = `${monster.name}`
    currentName.id = 'edit-name'
    let currentAge = document.createElement('input')
    currentAge.id = 'edit-age'
    currentAge.value = `${monster.age}`
    let currentDescription = document.createElement('input')
    currentDescription.id = 'edit-description'
    currentDescription.value = `${monster.description}`
    let updateButton = document.createElement('button')
    updateButton.innerText = 'Update!'
    EditMonsterForm.append(currentName,currentAge,currentDescription,updateButton)
    EditMonsterForm.addEventListener("submit",()=>patchTheMonsterAndUpdatePage(monster,newH2,newH4,newP,EditMonsterForm))
    originalDiv.appendChild(EditMonsterForm)
}

function patchTheMonsterAndUpdatePage(monster,newH2,newH4,newP,EditMonsterForm){
    //Patch the monster in db and update the values of the updated monster in the page
    event.preventDefault()
    let nameEdited = document.getElementById('edit-name').value
    let ageEdited = document.getElementById('edit-age').value
    let descriptionEdited = document.getElementById('edit-description').value
    let patchObject = {
        name: nameEdited,
        age: ageEdited,
        description: descriptionEdited
    }
    patch(BASE_MONSTER_URL,monster.id,patchObject).then(()=>{
        newH2.innerText = nameEdited,
        newH4.innerText = ageEdited,
        newP.innerText = descriptionEdited
        EditMonsterForm.remove()
    })
}

function deleteMonsterAndAlertThatItIsDeleted(monster,newDiv) {
    destroy(BASE_MONSTER_URL,monster.id).then(()=>{
        newDiv.remove()
        setTimeout(function(){window.alert(`${monster.name} Deleted!!!`)}, 500);
        getMonstersForLimitAndPage(batchSize,1)
    })
}

function forwardActions(){
    currentPage +=1
    getMonstersForLimitAndPage(batchSize,currentPage)
}

function backActions(){
    if (currentPage >1){
    currentPage -=1
    getMonstersForLimitAndPage(batchSize,currentPage)
}
}

//INITIAL LOADERS, UNRELATED EVENT LISTENERS
document.body.onload = createNewMonsterFormAndPopulateInitialBatchOfMonsters
forwardButton.addEventListener("click",forwardActions)
backButton.addEventListener("click",backActions)