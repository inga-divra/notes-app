const mongoose = require('mongoose');
const Note = require('./models/note');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://ingady:${password}@nodeexpressprojects.shkmp.mongodb.net/noteApp?retryWrites=true&w=majority&appName=NodeExpressProjects`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

// Create a new note
const note = new Note({
  content: 'HTML is easy',
  important: true,
});

// Save the note to the database
note.save().then((result) => {
  console.log('note saved!');

  // Fetch all notes from the database
  Note.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note);
    });
    mongoose.connection.close();
  });
});
