import React, { useState } from "react";
import Filter from "./components/Filter";
import EntryForm from "./components/EntryForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [filter, setFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  // Search bar
  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const personsToShow = persons.filter(
    (person) => person.name.toLowerCase().indexOf(filter) !== -1
  );

  // Input Form
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
      setNewName("");
      setNewNumber("");
    }
  };
  //

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
