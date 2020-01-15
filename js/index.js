document.addEventListener("DOMContentLoaded", function(){
    //global variables 

    const baseUrl = "http://localhost:3000/monsters"
    const mosnterContainer = document.querySelector("#monster-container")
    const createNewMonsterForm = document.querySelector("#form-create-monster")
    const forwardButton = document.querySelector("#forward")
    const backwardButton = document.querySelector("#back")
    let counter = 1

    //request functions
    function get(url){
        return fetch(url)
        .then((response) => response.json())
    }

    function post(url,bodyObject){
        return fetch(url,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(bodyObject)
        })
        .then((response) => response.json())
    }

    //functions

    function renderMonster(monster){
        let div = document.createElement("div")
        let h2 = document.createElement("h2")
        h2.innerText = monster.name
        let h4 = document.createElement("h4")
        h4.innerText = monster.age 
        let p = document.createElement("p")
        p.innerText = monster.description
        div.append(h2, h4, p)
        mosnterContainer.appendChild(div)
    }

    function getFirstFiftyMonsters(){
        let monsterPerPage = "_limit=50"
        let url = `${baseUrl}/?${monsterPerPage}&_page=1`

        get(url)
        .then((monsters) => monsters.forEach(renderMonster))
    }

    function createNewMonster(e){
        e.preventDefault()
        bodyObject = {
            name: createNewMonsterForm.name.value,
            age: parseInt(createNewMonsterForm.age.value),
            description: createNewMonsterForm.description.value
        }

        post(baseUrl, bodyObject)
    }

    function clearMonsters(){
        while(mosnterContainer.firstChild){
            mosnterContainer.removeChild(mosnterContainer.firstChild)
        }
    }

    function showMoreOrLessMonsters(event){
       clearMonsters() 
       if(event.target === forwardButton){
            counter ++
            let monsterPerPage = "_limit=50"
            let url = `${baseUrl}/?${monsterPerPage}&_page=${counter}`
            get(url)
            .then((monsters) => monsters.forEach(renderMonster))
       }else{
        counter --
        let monsterPerPage = "_limit=50"
        let url = `${baseUrl}/?${monsterPerPage}&_page=${counter}`
        get(url)
        .then((monsters) => monsters.forEach(renderMonster))
       }
    }

    // event listeners and run functions
    getFirstFiftyMonsters()
  

    createNewMonsterForm.addEventListener("submit", createNewMonster)
    forwardButton.addEventListener("click", showMoreOrLessMonsters)
    backwardButton.addEventListener("click", showMoreOrLessMonsters)
})