const express = require('express');
const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;
const app = express();

//middleware to load the CSS and JavaScript with the HTML serve
app.use(express.static('public'));
//parse the incoming string or array data
app.use(express.urlencoded({extend: true}));
//parse the incoming json data
app.use(express.json());


function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    personalityTraitsArray.forEach(trait => {
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

//functionality to create a new animal object
function createNewAnimal(body, animalsArray) {
  console.log(body);
  //function for the main code will be here!
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({animals: animalsArray}, null, 2)
  );
  
  //here will be the returned finished code to pose route for response
  return animal;
}

//validates the animal and returns false if invalid information
function validateAnimal(animal) {
  if(!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if(!animal.diet || typeof animal.species !== 'string') {
    return false;
  }
  if(!animal.diet  || typeof animal.diet !== 'string') {
    return false;
  }
  if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}  

app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

//if the new animal created is invalid returns 400 message, else it creates enw animal object in the array
app.post('/api/animals', (req, res) => {
    req.body.id = animals.length.toString();
    
    if(!validateAnimal(req.body)) {
      res.status(400).send('The animals is not properly formatted');
    
    } else {
      const animal = createNewAnimal(req.body, animals)

      console.log(req.body);
      res.json(animal);
    }

});

//routes to serve the html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//animals webpage route
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animal.html'));
});

//zookeepers webpage route
app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

//wildcard route catcher
app.get('*', (req, res) => {
  res.sendFile(path.send(__dirname, './public/index.html'));
});

//listens for the port to display the port number 
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
