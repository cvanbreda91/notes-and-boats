const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
const PORT = process.env.PORT || 3001;
const { notes } = require('./db/db.json');

function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id === id)[0];
  return result;
}

app.get('/api/notes',(req,res) => {
  res.json(notes);
})
app.get('/api/notes', (req, res) => {
  let results = notes;
  console.log(req.query)
  res.json(results);
});
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
app.get('/api/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes);
    res.json(result);
});
app.get('/api/animals', (req, res) => {
  let results = note;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();
  const note = createNewNote(req.body, notes);

  res.json(note);

  
});

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

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });