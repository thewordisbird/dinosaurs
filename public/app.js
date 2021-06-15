(function (){
    // Global scope constants
    const form = document.getElementById('dino-compare');
    const inptName = document.getElementById('name');
    const chkboxImperial = document.getElementById('imperial');
    const chkboxMetric = document.getElementById('metric');
    const inptDiet = document.getElementById('diet');
    const btnSubmit = document.getElementById('btn');
    const divError = document.getElementById('error');


    // Units objects
    let metric = {
        name: 'metric',
        height: 'centimeters.',
        weight: 'Kilograms',
        convertHeight: function (inches) {
            return 2.54 * inches;
        },
        convertWeight: function (lbs) {
            return .0453592 * lbs;
        }
    };

    let imperial = {
        name: 'imperial',
        height: 'inches',
        weight: 'lbs.',
    };

    let units = imperial;


    function dinoFactory (species, weight, height, diet, where, when, fact) {
        /**
        * @description Factory function to create an object representing a dinosaur.
        * @param {string} species - The species of the dinosaur.
        * @param {int} weight - The weight of the dinosaur.
        * @param {int} height - The height of the dinosaur.
        * @param {string} diet - The dinosaurs diet.
        * @param {string} where - The location the dinosaur lived.
        * @param {string} when - The period the dinosaur lived.
        * @param {string} fact - A fact about the dinosaur.
        * @returns {object} The dinosour object.
        */
        return {
            species: species,
            weight: {
                fact: weight,
                message: `The average ${species} weighed ${weight} ${units.weight}!`
            },
            height: {
                fact: height,
                message: `The average ${species} was ${height} ${units.height} tall!`
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
                /**
                * @description Compares the hight of the dinosaur to that of a human.
                * @param {object} human - Object representing a human with a height property.
                * @returns {string} A message comparing the heights of the dinsaur to the human.
                */
                let heightDif = this.height['fact'] - human.height;
                
                if (heightDif < 0) {
                    return `You are ${Math.abs(heightDif)} ${units.height} taller than the average ${this.species}!`;
                } else if (heightDif == 0) {
                    return `You are the same height as the average ${this.species}!`;
                } else {
                    return `You are ${Math.abs(heightDif)} ${units.height} shorter than the average ${this.species}!`;
                }
            },
            compareWeight: function (human) {
                /**
                * @description Compares the weight of the dinosaur to that of a human.
                * @param {object} human - Object representing a human with a weight property.
                * @returns {string} A message comparing the weights of the dinsaur to the human.
                */
                let weightDif = this.weight['fact'] - human.weight;
                
                if (weightDif < 0) {
                    return `You are ${Math.abs(weightDif)} ${units.weight} heavier than the average ${this.species}!`;
                } else if (weightDif == 0) {
                    return `You are the same weight as the average ${this.species}!`;
                } else {
                    return `You are ${Math.abs(weightDif)} ${units.weight} lighter than the average ${this.species}!`;
                }
            },
            compareDiet: function (human) {
                /**
                * @description Compares the diets of the dinosaur to that of a human.
                * @param {object} human - Object representing a human with a diet property.
                * @returns {string} A message comparing the diets of the dinsaur to the human.
                */
                if (this.diet.fact == human.diet) {
                    return `The ${this.species} and you are both ${this.diet.fact}s!`;
                } else {
                    return `The ${this.species} and you have different diets! `;
                }
            },
            getImageUrl: function () {
                /**
                * @description Builds the image url for the dinosaur.
                * @returns {string} A url to the image of the dinosaur.
                */
                const species = this.species.toLowerCase();
                return `images/${species}.png`;
            },
            generateTile: function (human) {
                /**
                * @description Generates html tile displaying the species, the dinosaur image and a randomly generated fact.
                * @param {object} human - Object representing a human.
                * @returns {string} A html string of the tile.
                */
                let html = `
                 <div class="grid-item">
                    <h3>${this.species}</h3>
                    <img src="${this.getImageUrl()}" alt="${this.species}">
                    <p>${this.getRandomFact(human)}</p>        
                 </div>
                 `;
                return html;
            },
            getRandomFact: function (human) {
                /**
                * @description Get a random 'fact' property or method from the dinosaur object.
                * <br>The 'fact' properties/methods start at the 2nd property in the object and go to the (n - 3)th property/method.
                * @param {object} human - Object representing a human.
                * @returns {string} A message with the fact information.
                */
                // If species is bird, return the fact
                if (this.species == 'Pigeon') {
                    return this.fact.message;
                }

                // Assumes Facts lie between index 1 and n - 3 in object keys
                let factCount = Object.keys(this).length - 4;
                let factKey = Object.keys(this)[1 + Math.floor(Math.random() * factCount)];
                
                // Check if fact is a comparison method or just a string
                if (typeof(this[factKey]) == "function" ) {
                    return this[factKey](human);
                } else {
                    // Determine if fact is unit specific
                    if ('imperial' in this[factKey] ) {
                        return this[factKey][units]['message'];
                    } else {
                        return this[factKey]['message'];
                    }
                }
            }
        };
    }


    async function getDinoData() {
        /**
        * @description API call to dino.json to retrieve dionsaur information.
        */
        let url = './dino.json';
        console.log(url);
        try {
            let resp = await fetch(url, {
                mode: 'no-cors'
            });
            return resp.json();
            
        } catch (error) {
            // Log error message to the console
            console.log ('An error occured attempting to retrieve data from the API.');
        }
    }
    

    const createDinos = function (jsonData, unitSys) {
        /**
        * @description Creates dinosour objects by passing dinosaur json data to the dinoFactory.
        * @param {object} jsonData - Dino data in JSON format.
        * @returns {object} Dinosaur object.
        */
        let dinos = new Array;

        jsonData.forEach( dino => {
            if (unitSys == 'imperial') {
                dinos.push(dinoFactory(dino.species, dino.weight, dino.height,
                    dino.diet, dino.where, dino.when, dino.fact));
            } else if (unitSys == 'metric') {
                dinos.push(dinoFactory(dino.species, metric.convertWeight(dino.weight),
                    metric.convertHeight(dino.height), dino.diet, dino.where, dino.when, dino.fact));
            }
        });
        
        return dinos;
    };
    

    function humanFactory (name, height, weight, diet) {
        /**
        * @description Factory function to create an object representing a human.
        * @param {string} name - The name of the human.
        * @param {int} height - The height of the dinosaur.
        * @param {int} weight - The weight of the dinosaur.
        * @param {string} diet - The humans diet.
        * @returns {object} The human object.
        */
        return {
            name: name,
            height: height,
            weight: weight,
            diet: diet,
            getImageUrl: function () {
                /**
                * @description Builds the image url for the human.
                * @returns {string} A url to the image of the human.
                */
                return `images/human.png`;
            },
            generateTile: function () {
                /**
                * @description Generates html tile displaying the name, and image for the human.
                * @returns {string} A html string of the tile.
                */
                let html = `
                 <div class="grid-item">
                    <h3>${this.name}</h3>
                    <img src="${this.getImageUrl()}" alt="${this.name}">        
                 </div>
                 `;
                return html;
            }
        };
    }


    // Fields to modify on unit system change
    const imperialFields = document.getElementById('imperial-fields');
    const metricFields = document.getElementById('metric-fields');

    // Add click event listener to the 'Imperial' radio button to set the
    // fields to collect imperial data. This is the default
    chkboxImperial.addEventListener('click', () => {
        if (units.name != 'imperial') {
            units = imperial;
            metricFields.innerHTML = '';
            imperialFields.innerHTML = `
           <p>Height:</p>
            <label>Feet: <input id="feet" class="form-field__short" type="number" name="feet" required></label>
            <label>inches: <input id="inches" class="form-field__short" type="number" name="inches" required></label>
            <p>Weight:</p>
            <label><input id="weight" class="form-field__full" type="number" name="weight" required>lbs</label>
           `;
        }
   
    });

    
    // Add click event listener to the 'Metric' radio button to set the
    // fields to collect metric data.
    chkboxMetric.addEventListener('click', () => {
        if (units.name != 'metric') {
            units = metric;
            imperialFields.innerHTML = '';
            metricFields.innerHTML = `
        <p>Height:</p>
        <label><input id="centimeters" class="form-field__full" type="number" name="centimeters" required>Centimeters</label>
        <p>Weight:</p>
        <label><input id="weight" class="form-field__full" type="number" name="weight" required>Kilograms</label>
        `;
        
        }
    });

    // Add click event listener to the 'Compare Me!' button on the form.
    // Once the form data is validated, the form is removed and the infographic
    // with the human in the middle sourounded by 7 dinosaur tiles and a bird
    // tile is displayed.
    btnSubmit.addEventListener('click', () => {
        const grid = document.getElementById('grid');

        let validationStatus = true;
        let validationMessage = new Array;
        let name = inptName.value;

        if (name == '') {
            validationStatus = false;
            validationMessage.push('Please provide your name.');
        }

        let height;
        let weight;

        if (units.name == 'imperial' ) {
            // Validate imperial data fields on form
            const inptHeightFeet = document.getElementById('feet');
            const inptHeightInches = document.getElementById('inches');
            
            height = parseInt(inptHeightFeet.value) * 12 + parseInt(inptHeightInches.value);

            if (height <= 0 ) {
                validationStatus = false;
                validationMessage.push('Height must be a positive integer value.');
            } else if (inptHeightFeet.value == '' || inptHeightInches.value == '') {
                validationStatus = false;
                validationMessage.push('Both Feet and Inches are required.');
            }

            const inptWeightLbs = document.getElementById('weight');

            weight = parseInt(inptWeightLbs.value);

            if (weight <= 0) {
                validationStatus = false;
                validationMessage.push('Weight must be a positive integer value.');
            } else if (inptWeightLbs.value == '') {
                validationStatus = false;
                validationMessage.push('Weight is required');
            }

        } else {
            // Validate metric data fields on form
            const inptCentimeters = document.getElementById('centimeters');
            
            height = parseInt(inptCentimeters.value);

            if (height <= 0 ) {
                validationStatus = false;
                validationMessage.push('Height must be a positive integer value.');
            } else if (inptCentimeters.value == '') {
                validationStatus = false;
                validationMessage.push('Height is required.');
            }

            const inptWeightKgs = document.getElementById('weight');

            weight = parseInt(inptWeightKgs.value);

            if (weight <= 0) {
                validationStatus = false;
                validationMessage.push('Weight must be a positive integer value.');
            } else if (inptWeightKgs.value == '') {
                validationStatus = false;
                validationMessage.push('Weight is required');
            }
        }
        
        let diet = inptDiet.value;

        // If there are no data input errors, create the infographic.
        // Otherwise indicate errors to user
        if (validationStatus == false ) {
            // TODO: UI Validation
            divError.innerHTML = `<div class="flash-error-message"> ${validationMessage.join('<br>')}</div>`;
        } else {
            // Use IIFE to get human data from form
            const human = (function (name, height, weight, diet) {
                return humanFactory(name, height, weight, diet);
            })(name, height, weight, diet);

            // Hide input form
            form.style.display = "none";

            // Make API Call to get Dino Data and make tiles once response is returned
            getDinoData().then( resp => {
                
                let dinoData = createDinos(resp.Dinos, units.name);

                for (let i = 0; i < 9; i++) {
                    if (i < 4) {
                        grid.innerHTML += dinoData[i].generateTile(human);
                    } else if (i == 4) {
                        grid.innerHTML += human.generateTile();
                    } else {
                        grid.innerHTML += dinoData[i-1].generateTile(human);
                    }
                }
            });
        }
    });
}());
    