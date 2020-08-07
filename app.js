(function (){

    const inptName = document.getElementById('name');
    const inptHeightFeet = document.getElementById('feet');
    const inptHeightInches = document.getElementById('inches')
    const inptWeightLbs = document.getElementById('weight')
    const inptDiet = document.getElementById('diet')
    const btnSubmit = document.getElementById('btn');
    
    // Dino Object Factory
    function dinoFactory (species, weight, height, diet, where, when, fact) {
        return {
            species: species,
            weight: weight,
            height: height,
            diet: diet,
            where: where,
            when: when,
            fact: fact,

            compareHeight: function (humanHeight) {
                return this.height - humanHeight;
            },

            compareWeight: function (humanWeight) {
                return this.weight - humanWeight;
            },

            compareDiet: function (humanDiet) {
                if (this.diet == humanDiet) {
                    return `The ${this.species} and you are both ${this.diet}s!`
                } else {
                    return `The ${this.species} and you have different diets! `
                }
            },

            getImageUrl: function () {
                return `./images/${this.species}.png`
            },

            generateTile: function () {
                let html = `
                 <div class="grid-item">
                     <img src="${this.getImageUrl()}" alt="${this.species}">        
                 </div>
                 `
                 return html
             }
            
        };
    };

    // API call to fetch dino data from dino.json
    async function getDinoData() {
        let url = './dino.json'

        try {
            let resp = await fetch(url)
            return resp.json()
            
        } catch (error) {
            console.log (error)
        }
    }
    

    // Create Dino Objects from JSON Data
    const createDinos = function (jsonData) {        
        let dinos = new Array
        console.log('in create dinos')
        for (dino of jsonData) {
            console.log(dino)
            dinos.push(dinoFactory(dino.species, dino.weight, dino.height, dino.diet, dino.where, dino.when, dino.fact))   
        };
        return dinos
    };
    

    // Human Object Factory
    function humanFactory (name, height, weight, diet) {
        return {
            name: name,
            height: height,
            weight: weight,
            diet: diet,

            getImageUrl: function () {
                return './images/human.png'
            },

            generateTile: function () {
                let html = `
                 <div class="grid-item">
                     <img src="${this.getImageUrl()}" alt="${this.name}">        
                 </div>
                 `
                 return html
             }
        };
    };


    // On button click, prepare and display infographic
    btnSubmit.addEventListener('click', e => {
        const grid = document.getElementById('grid');
        //console.log(createDinos(dinoData))
        let name = inptName.value;
        let height = parseInt(inptHeightFeet.value) * 12 + parseInt(inptHeightInches.value);
        let weight = parseInt(inptWeightLbs.value);
        let diet = inptDiet.value;

        // Use IIFE to get human data from form
        const human = (function (name, height, weight, diet) {
            return humanFactory(name, height, weight, diet)
        })(name, height, weight, diet);
        
        // Make API Call to get Dino Data and make tiles once response is returned
        getDinoData().then( resp => {
            
            let dinoData = createDinos(resp.Dinos);
            console.log(dinoData)
            for (let i = 0; i < 9; i++) {
                if (i < 4) {
                    console.log(dinoData[i].generateTile())
                    grid.innerHTML += dinoData[i].generateTile()               
                } else if (i == 4) {
                    console.log(human.generateTile())
                    grid.innerHTML += human.generateTile()
                } else {
                    console.log(dinoData[i-1].generateTile())
                    grid.innerHTML += dinoData[i-1].generateTile()
                };
            };       
        });
    })
    
}());
    