import React, { useState } from "react";
import ReactDOM from "react-dom";

const Button = (props) => <button onClick={props.handler}>{props.text}</button>;
const Counter = (props) => <p>Anecdote has {props.value} votes.</p>;
const Anecdote = (props) => (
  <div>
    {props.text}
    <Counter value={props.value} />
  </div>
);

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const getRandom = (max) => {
    //Return int between 0 and max
    max = Math.floor(max);
    return Math.floor(Math.random() * max);
  };

  const updateVotes = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  };

  const top = votes.indexOf(Math.max(...votes));

  return (
    <div>
      <h1>Today's Anecdote:</h1>
      <Anecdote text={props.anecdotes[selected]} value={votes[selected]} />
      <div>
        <Button text="vote" handler={updateVotes} />
        <Button
          text="next anecdote"
          handler={() => setSelected(getRandom(anecdotes.length))}
        />
      </div>
      <h1>Top Anecdote:</h1>
      <Anecdote text={props.anecdotes[top]} value={votes[top]} />
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
