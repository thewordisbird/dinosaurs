(function (){
    // Global scope constants
    const form = document.getElementById('dino-compare')
    const inptName = document.getElementById('name');
    const chkboxImperial = document.getElementById('imperial');
    const chkboxMetric = document.getElementById('metric');
    
    
    const inptDiet = document.getElementById('diet')
    const btnSubmit = document.getElementById('btn');

    // Global scope variables
    let units = 'imperial';



    // Dino Object Factory
    function dinoFactory (species, weight, height, diet, where, when, fact) {
        // TODO: Add number formatting with commas
        return {
            species: species,
            weight: {
                imperial: {
                    fact: parseInt(weight), 
                    message: `The average ${species} weighed ${weight} lbs.!`
                },
                metric: {
                    fact: parseInt(weight), 
                    message: `The average ${species} weighed ${weight} kgs.!`
                }
                
            },
            height: { 
                imperial: {
                    fact: parseInt(height),
                    message: `The average ${species} was ${height} inches tall!`
                },
                metric: {
                    fact: parseInt(height),
                    message: `The average ${species} was ${height} centimeters tall!`
                }
                
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
                console.log('compare heights')
                console.log(this.height[units])
                let heightDif = this.height[units]['fact'] - human.height;
                
                if (heightDif < 0) {
                    return `You are ${Math.abs(heightDif)} inches taller than the average ${this.species}!`
                } else if (heightDif == 0) {
                    return `You are the same height as the average ${this.species}!`
                } else {
                    return `You are ${Math.abs(heightDif)} inches shorter than the average ${this.species}!`
                }
                
            },

            compareWeight: function (human) {
                console.log('compare weights')
                console.log(this.weight[units])
                let weightDif = this.weight[units]['fact'] - human.weight;
                
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
                console.log(factKey)
                if (typeof(this[factKey]) == "function" ) {
                    return this[factKey](human)
                } else {
                    // Determine if fact is unit specific
                    if ('imperial' in this[factKey] ) {
                        return this[factKey][units]['message']
                    } else {
                        return this[factKey]['message']
                    }
                    
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
        for (dino of jsonData) {
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


    // Form change form units (Default Imperial)
    const imperialFields = document.getElementById('imperial-fields')
    const metricFields = document.getElementById('metric-fields')

   chkboxImperial.addEventListener('click', e => {
       if (units != 'imperial') {
           units = 'imperial'
           metricFields.innerHTML = ''
           imperialFields.innerHTML = `
           <p>Height:</p>
            <label>Feet: <input id="feet" class="form-field__short" type="number" name="feet" required></label>
            <label>inches: <input id="inches" class="form-field__short" type="number" name="inches" required></label>
            <p>Weight:</p>
            <label><input id="weight" class="form-field__full" type="number" name="weight" required>lbs</label>
           `
   }
   
})


   chkboxMetric.addEventListener('click', e => {
    if (units != 'metric') {
        units = 'metric'
        imperialFields.innerHTML = ''
        metricFields.innerHTML = `
        <p>Height:</p>
        <label><input id="centimeters" class="form-field__full" type="number" name="centimeters" required>Centimeters</label>
        <p>Weight:</p>
        <label><input id="weight" class="form-field__full" type="number" name="weight" required>Kilograms</label>
        `
        
    }
})

    // On button click, prepare and display infographic
    btnSubmit.addEventListener('click', e => {
        const grid = document.getElementById('grid');
        let validationStatus = true;
        let validationMessage = ''
        let name = inptName.value;
        if (name == '') {
            validationStatus = false;
            validationMessage += 'Please provide your name.\n'}

        let height;
        let weight;

        if (units == 'imperial' ) {
            const inptHeightFeet = document.getElementById('feet');
            const inptHeightInches = document.getElementById('inches')
            height = parseInt(inptHeightFeet.value) * 12 + parseInt(inptHeightInches.value);
            if (height <= 0 ) {
                validationStatus = false;
                validationMessage += 'Height must be a positive integer value.\n';
            } else if (inptHeightFeet.value == '' || inptHeightInches.value == '') {
                validationStatus = false;
                validationMessage += 'Both Feet and Inches are required.\n'
            }

            const inptWeightLbs = document.getElementById('weight')
            weight = parseInt(inptWeightLbs.value);
            if (weight <= 0) {
                validationStatus = false;
                validationMessage += 'Weight must be a positive integer value.\n'
            } else if (inptWeightLbs.value == '') {
                validationStatus = false;
                validationMessage += 'Weight is required\n'
            }

        } else {
            const inptCentimeters = document.getElementById('centimeters');
            height = parseInt(inptCentimeters.value);
            if (height <= 0 ) {
                validationStatus = false;
                validationMessage += 'Height must be a positive integer value.\n';
            } else if (inptCentimeters.value == '') {
                validationStatus = false;
                validationMessage += 'Both Feet and Inches are required.\n'
            }

            const inptWeightKgs = document.getElementById('weight')
            weight = parseInt(inptWeightKgs.value);
            if (weight <= 0) {
                validationStatus = false;
                validationMessage += 'Weight must be a positive integer value.\n'
            } else if (inptWeightKgs.value == '') {
                validationStatus = false;
                validationMessage += 'Weight is required\n'
            }
        }
        
        
        let diet = inptDiet.value;

        if (validationStatus == false ) {
            console.log(validationMessage)
            //TODO: UI Validation 
        } else {
            // Use IIFE to get human data from form
            const human = (function (name, height, weight, diet) {
                return humanFactory(name, height, weight, diet)
            })(name, height, weight, diet);

            // Hide input form
            form.style.display = "none"

            // Make API Call to get Dino Data and make tiles once response is returned
            getDinoData().then( resp => {
                
                let dinoData = createDinos(resp.Dinos);
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


        };
        

        
    })

}());
    