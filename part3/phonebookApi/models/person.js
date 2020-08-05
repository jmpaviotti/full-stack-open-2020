const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString();
    delete returned._id;
    delete returned.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
