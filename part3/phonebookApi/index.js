const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

const PORT = process.env.PORT || 3001;

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  { name: 'Arto Hellas', number: '040-123456', id: 1 },
  { name: 'Ada Lovelace', number: '040-654321', id: 2 },
  { name: 'Dan Abramov', number: '123-456789', id: 3 },
  { name: 'Mary Poppendick', number: '11-4034562', id: 4 },
];

app.get('/info', (req, res) => {
  const timestamp = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people.</p><p>${timestamp}</p>`
  );
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const entry = persons.find((el) => el.id === id);
  if (entry) {
    res.json(entry);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((el) => el.id !== id);

  res.status(204).end();
});

const randId = () => {
  const max = 100000;
  return Math.ceil(Math.random() * max);
};

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: 'name/number missing',
    });
  }

  const match = persons.find((el) => el.name === name);
  if (match) {
    return res.status(400).json({
      error: 'name is already in database',
    });
  }

  const entry = {
    name,
    number,
    id: randId(),
  };

  persons.push(entry);

  res.json(entry);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
