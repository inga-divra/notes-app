require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path'); // Include the 'path' module to handle file paths correctly
const Note = require('./models/note');

// Middleware
app.use(express.json());

//Logger middleware
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};
app.use(requestLogger);

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Get ALL NOTES
app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// Create NEW NOTE
app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: 'Content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

// Get SINGLE NOTE
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Route for updating a note
app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const note = notes.find((note) => note.id === id);

  if (!note) {
    return response.status(404).json({
      error: 'note not found',
    });
  }

  note.content = body.content || note.content;
  note.important =
    body.important !== undefined ? body.important : note.important;

  response.json(note);
});

// Route for deleting a note
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

// Middleware for handling unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

// Middleware for handling errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  next(error);
};
app.use(errorHandler);

// Start the server on specified port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
