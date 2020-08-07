(function (){
    const form = document.getElementById('dino-compare')
    const inptName = document.getElementById('name');
    const inptHeightFeet = document.getElementById('feet');
    const inptHeightInches = document.getElementById('inches')
    const inptWeightLbs = document.getElementById('weight')
    const inptDiet = document.getElementById('diet')
    const btnSubmit = document.getElementById('btn');
    
    // Dino Object Factory
    function dinoFactory (species, weight, height, diet, where, when, fact) {
        // TODO: Add number formatting with commas
        return {
            species: species,
            weight: {
                fact: parseInt(weight), 
                message: `The average ${species} weighed ${weight} lbs.!`
            },
            height: {
                fact: parseInt(height),
                message: `The average ${species} was ${height} inches tall!`
            },
            diet: {
                fact: diet,
                message: `The ${species} was a ${diet}!`
            },
            where: {
                fact: where,
                message: `The ${species} lived in ${where}!`
            },
            when: {
                fact: when,
                message: `The ${species} lived in the ${when} period!`
            },
            fact: {
                fact: fact,
                message: fact
            },

            compareHeight: function (human) {
                let heightDif = this.height.fact - human.height;
                
                if (heightDif < 0) {
                    return `You are ${Math.abs(heightDif)} inches taller than the average ${this.species}!`
                } else if (heightDif == 0) {
                    return `You are the same height as the average ${this.species}!`
                } else {
                    return `You are ${Math.abs(heightDif)} inches shorter than the average ${this.species}!`
                }
                
            },

            compareWeight: function (human) {
                let weightDif = this.weight.fact - human.weight;
                
                if (weightDif < 0) {
                    return `You are ${Math.abs(weightDif)} lbs. heavier than the average ${this.species}!`
                } else if (weightDif == 0) {
                    return `You are the same weight as the average ${this.species}!`
                } else {
                    return `You are ${Math.abs(weightDif)} lbs. lighter than the average ${this.species}!`
                }
            },

            compareDiet: function (human) {
                if (this.diet.fact == human.diet) {
                    return `The ${this.species} and you are both ${this.diet.fact}s!`
                } else {
                    return `The ${this.species} and you have different diets! `
                }
            },

            getImageUrl: function () {
                return `./images/${this.species}.png`
            },

            generateTile: function (human) {
                let html = `
                 <div class="grid-item">
                    <h3>${this.species}</h3>
                    <img src="${this.getImageUrl()}" alt="${this.species}">
                    <p>${this.getRandomFact(human)}</p>        
                 </div>
                 `
                 return html
             },

             getRandomFact: function (human) {
                // If species is bird, return the fact
                if (this.species == 'Pigeon') {
                    return this.fact.message
                }
                // Assumes Facts lie between index 1 and n - 3 in object keys
                let factCount = Object.keys(this).length - 4
                let factKey = Object.keys(this)[1 + Math.floor(Math.random() * factCount)]

                // Check if fact is a comparison method or just a string
                if (typeof(this[factKey]) == "function" ) {
                    console.log(factKey)
                    return this[factKey](human)
                } else {
                    return this[factKey]['message']
                }

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
                    <h3>${this.name}</h3>
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

        // Hide input form
        form.style.display = "none"

        // Make API Call to get Dino Data and make tiles once response is returned
        getDinoData().then( resp => {
            
            let dinoData = createDinos(resp.Dinos);
            console.log(dinoData)
            for (let i = 0; i < 9; i++) {
                if (i < 4) {
                    grid.innerHTML += dinoData[i].generateTile(human)               
                } else if (i == 4) {
                    grid.innerHTML += human.generateTile()
                } else {
                    grid.innerHTML += dinoData[i-1].generateTile(human)
                };
            };       
        });
    })

}());
    