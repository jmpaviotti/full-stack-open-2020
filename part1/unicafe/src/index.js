import React, { useState } from "react";
import ReactDOM from "react-dom";

const Button = (props) => <button onClick={props.handler}>{props.text}</button>;

const Statistic = (props) => (
  <p>
    {props.text} {props.value}
  </p>
);

const Statistics = (props) => {
  const { good, neutral, bad } = props;

  const total = good + neutral + bad;

  if (total === 0) {
    return <p>No feedback given.</p>;
  }

  const data = {
    total: total,
    average: (good - bad) / total,
    positive: (good * 100) / total,
  };

  return (
    <div>
      <Statistic text="good" value={good} />
      <Statistic text="neutral" value={neutral} />
      <Statistic text="bad" value={bad} />
      <Statistic text="all" value={data.total} />
      <Statistic text="average" value={data.average} />
      <Statistic text="positive" value={data.positive + " %"} />
    </div>
  );
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button text="good" handler={() => setGood(good + 1)} />
      <Button text="neutral" handler={() => setNeutral(neutral + 1)} />
      <Button text="bad" handler={() => setBad(bad + 1)} />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
