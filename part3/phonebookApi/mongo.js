const mongoose = require('mongoose')

const args = process.argv

if (args.length < 3) {
  console.log(
    'Fetch data: node mongo.js <password> | Add new entry: node mongo.js <password> <name> <number>'
  )
  process.exit(1)
}

// Connect to DB / Create Schema
const password = args[2]

const url = `mongodb+srv://jmpaviotti:${password}@fullstackopen.lzd3i.gcp.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Fetch all
if (args.length === 3) {
  console.log('phonebook:')
  Person.find({}).then((res) => {
    res.forEach((entry) => {
      console.log(entry.name, entry.number)
    })
    mongoose.connection.close()
  })
}

// Add entry
if (args.length >= 5) {
  const name = args[3]
  const number = args[4]

  const entry = new Person({
    name,
    number,
  })

  entry.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
