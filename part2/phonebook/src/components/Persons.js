import React from "react";

const Person = ({ entry }) => {
  return (
    <div>
      {entry.name} {entry.number}
    </div>
  );
};

const Persons = ({ array }) => {
  return (
    <div>
      {array.map((el) => (
        <Person key={el.name} entry={el} />
      ))}
    </div>
  );
};

export default Persons;
