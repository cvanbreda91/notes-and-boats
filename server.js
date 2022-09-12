//declare dependancies
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));
const PORT = process.env.PORT || 3001;
const { notes } = require('./db/db.json');

//create functions for queries 
function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id === id)[0];
  return result;
}

function filterByQuery(query, notesArray) {
  let filteredResults = notesArray;
  if (query.title) {
    filteredResults = filteredResults.filter(note => note.title === note.title);
  }
  if (query.text) {
    filteredResults = filteredResults.filter(note => note.text === query.text);
  }
  return filteredResults;
}

//create a new note and add it to JSON array
function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note)
  console.log(body);
  // our function's main code will go here!
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  // return finished code to post route for response
  return note;
}

//add validation
function validateNote(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.text|| typeof note.text !== 'string') {
    return false;
  }
  return true;
}

//GET requests
app.get('/api/notes',(req,res) => {
  res.json(notes);
})
app.get('/api/notes', (req, res) => {
  let results = notes;
  console.log(req.query)
  res.json(results);
});
app.get('/api/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes);
    res.json(result);
});
app.get('/api/notes', (req, res) => {
  let results = note;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

//POST requests
app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();
  // if any data in req.body is incorrect, send 400 error back
  if (!validateNote(req.body)) {
    res.status(400).send('The note is not properly formatted.');
  } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
  }  
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//Delete JSON objects
app.delete("/api/notes/:id", (req, res) => {
  console.log("Method called is -- ", req.method)

  var indexOfNoteInJson = notes.map(function(notes) { return notes.id; }).indexOf(req.params.id); //find the index of :id
  if(indexOfNoteInJson === -1) {
    res.statusCode = 404;
    return res.send('Error 404: No ID found');
  }

  var result = notes.splice(indexOfNoteInJson,1);
  fs.writeFile('./db/db.json', JSON.stringify(result), function(err){
   if(err) throw err;
   res.json(true);
 });
  
})

//PORT
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });