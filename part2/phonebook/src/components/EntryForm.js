import React from "react";

const EntryForm = ({
  name,
  number,
  nameHandler,
  numberHandler,
  formHandler,
}) => {
  return (
    <form onSubmit={formHandler}>
      <div>
        name: <input value={name} onChange={nameHandler} />
      </div>
      <div>
        number: <input value={number} onChange={numberHandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default EntryForm;
