import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import EntryForm from './components/EntryForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState('');
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  // Search bar functions
  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const personsToShow = persons.filter(
    (person) => person.name.toLowerCase().indexOf(filter) !== -1
  );

  // Input Form functions
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addEntry = (event) => {
    event.preventDefault();

    if (persons.some((element) => element.name === newName)) {
      window.alert(`${newName} is already in phonebook.`);
    } else {
      const entry = { name: newName, number: newNumber };
      setPersons(persons.concat(entry));
      setNewName('');
      setNewNumber('');
    }
  };

  // Fetch initial data
  useEffect(() => {
    axios.get('http://localhost:3001/persons').then((response) => {
      setPersons(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={filter} handler={handleFilterChange} />

      <h2>Add new</h2>

      <EntryForm
        name={newName}
        number={newNumber}
        nameHandler={handleNameChange}
        numberHandler={handleNumberChange}
        formHandler={addEntry}
      />

      <h2>Numbers</h2>

      <Persons array={personsToShow} />
    </div>
  );
};

export default App;
