import React from 'react';

const Person = ({ entry, handler }) => {
  return (
    <div>
      {entry.name} {entry.number}{' '}
      <button onClick={() => handler(entry)}>delete</button>
    </div>
  );
};

const Persons = ({ array, handler }) => {
  return (
    <div>
      {array.map((el) => (
        <Person key={el.name} entry={el} handler={handler} />
      ))}
    </div>
  );
};

export default Persons;
