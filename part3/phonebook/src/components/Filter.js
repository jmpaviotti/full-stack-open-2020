import React from "react";

const Filter = ({ value, handler }) => {
  return (
    <div>
      Filter shown with <input value={value} onChange={handler} />
    </div>
  );
};

export default Filter;
