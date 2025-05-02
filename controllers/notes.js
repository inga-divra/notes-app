const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// Function to extract token from request headers
const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// Get all notes
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

// Update a note
notesRouter.put('/:id', async (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
    new: true
  })
  response.json(updatedNote)
})

// Create a new note
notesRouter.post('/', async (request, response) => {
  const body = request.body

  // Get token from request headers
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  // If token is invalid or not provided, respond with an error
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  // Find the user based on the ID from the token
  const user = await User.findById(decodedToken.id)

  // Create a new note
  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user._id
  })

  const savedNote = await note.save()

  // Add the note to the user's list of notes
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

// Get a single note by ID
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// Delete a note by ID
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = notesRouter
