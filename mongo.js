const mongoose = require('mongoose')
const Note = require('./models/note')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://ingady:${password}@nodeexpressprojects.shkmp.mongodb.net/noteApp?retryWrites=true&w=majority&appName=NodeExpressProjects`

mongoose.set('strictQuery', false)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')

    // Create a new note
    const note1 = new Note({
      content: 'HTML is easy',
      important: true
    })

    const note2 = new Note({
      content: 'Node.js is awesome',
      important: true
    })

    // Save the notes to the database
    return note1
      .save()
      .then(() => {
        console.log('first note saved!')

        return note2.save()
      })
      .then(() => {
        console.log('second note saved!')
        // Fetch all notes from the database
        return Note.find({})
      })
      .then((result) => {
        result.forEach((note) => {
          console.log(note)
        })
      })
      .catch((error) => {
        console.error('Error saving notes or fetching them', error)
      })
      .finally(() => {
        mongoose.connection.close()
      })
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error)
    process.exit(1)
  })
