import React, { useState, useEffect } from 'react';
import Notification from './components/Notification';
import Filter from './components/Filter';
import EntryForm from './components/EntryForm';
import Persons from './components/Persons';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageColor, setMessageColor] = useState('');
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
    const newEntry = { name: newName, number: newNumber };
    const isUnique = persons.find((el) => el.name === newEntry.name);

    if (isUnique) {
      const id = isUnique.id;
      if (
        window.confirm(
          `${newName} is already in phonebook, do you want to replace the old phone number with a new one?`
        )
      ) {
        personService
          .update(newEntry, id)
          .then((returnedEntry) => {
            setPersons(
              persons.map((person) =>
                person.id !== id ? person : returnedEntry
              )
            );
            setMessageColor('green');
            setMessage(`Updated ${newEntry.name}`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
            setNewName('');
            setNewNumber('');
          })
          .catch((error) => {
            setMessageColor('red');
            setMessage(
              `Entry for '${newEntry.name}' has already been removed from server`
            );
            setTimeout(() => {
              setMessage(null);
            }, 5000);
            setPersons(persons.filter((el) => el.id !== id));
          });
      }
    } else {
      personService.add(newEntry).then((returnedEntry) => {
        setPersons(persons.concat(returnedEntry));
        setMessageColor('green');
        setMessage(`Added ${newEntry.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        setNewName('');
        setNewNumber('');
      });
    }
  };

  // Handler for removing a single person
  const removePersonHandler = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id).then((returned) => {
        setPersons(persons.filter((el) => el.id !== person.id));
      });
    }
  };

  // Fetch initial data
  useEffect(() => {
    personService.getAll().then((baseData) => {
      setPersons(baseData);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} color={messageColor} />

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

      <Persons array={personsToShow} handler={removePersonHandler} />
    </div>
  );
};

export default App;
