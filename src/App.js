import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const [word, setWord] = useState("");
  const [inputText, setInputText] = useState("");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(6);

  const shouldRun = useRef(true);

  async function getWord() {
    const response = await axios.get(
      "https://random-word-api.herokuapp.com/word"
    );
    setWord(response.data[0]);
  }

  function checkLetter(event) {
    if (event.key !== word[index]) {
      event.preventDefault();
    }
  }

  function handleChange(event) {
    const wordArr = word.split("");

    if (event.target.value[index] === wordArr[index]) {
      setInputText(event.target.value);
      setIndex(index + 1);
    }

    if (event.target.value === word) {
      setScore(score + 1);
      setIndex(0);
      setInputText("");
      getWord();
      setTimer(timer + 5);
      event.target.value = "";
    }
  }

  function countDown(time) {
    setTimer(time - 1);
  }

  useEffect(() => {
    if (shouldRun.current) {
      setInterval(setTimer(timer - 1), 1000);
      getWord();
      shouldRun.current = false;
    }

    const intervalId = setInterval(() => {
      countDown(timer);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  return (
    <div className="App">
      <h1>{timer}</h1>
      <h1>{word}</h1>
      <input
        type="text"
        id="text"
        onKeyDown={checkLetter}
        onChange={handleChange}
        spellCheck="false"
      />
      <h1>{inputText}</h1>
      <h1>{score}</h1>
    </div>
  );
}

export default App;
