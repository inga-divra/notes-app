require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path') // Include the 'path' module to handle file paths correctly
const Note = require('./models/note')
const config = require('./utils/config')
const logger = require('./utils/logger')

logger.info(`Server running on port ${config.PORT}`)

// Middleware
app.use(express.json())

//Logger middleware
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')))

// Middleware for handling unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Middleware for handling errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// Start the server on specified port
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
