require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')

const mongoose = require('mongoose')

logger.info('Connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) => logger.error('Error connecting to MongoDB:', error.message))

// Middleware
app.use(express.json())
app.use(middleware.requestLogger)
app.use(express.static(path.join(__dirname, 'dist')))

// Routes
app.use('/api/notes', notesRouter)

// Error handling
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
