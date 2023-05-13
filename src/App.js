import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const [word, setWord] = useState("");
  const [inputText, setInputText] = useState("");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [playing, setPlaying] = useState(false)

  // Ref for the useEffect to execute once
  const shouldRun = useRef(true);

  // API call to get a random word
  async function getWord() {
    const response = await axios.get(
      "https://random-word-api.herokuapp.com/word"
    );
    setWord(response.data[0]);
  }

  // Checks the keypress to the current indexed letter in current wored. If they do not match it prevents typing in the input.
  function checkLetter(event) {
    if (event.key !== word[index]) {
      event.preventDefault();
    }
  }

  // handles text in the input and increases inex when the right letters are pressed.
  // also handles when input matches the current word.
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

  // function for setInterval
  function countDown(time) {
    setTimer(time - 1);
  }

  //handles setting the timer and changes the state of playing
  function playGame(){
    setTimer(5)
    setPlaying(true)
  }


  useEffect(() => {
  // prevents getword from running twice when app mounts
    if (shouldRun.current) {
      getWord();
      shouldRun.current = false;
    }

    // game timer 
    while(playing === true){
      const intervalId = setInterval(() => {
      countDown(timer);
    }, 1000);

    if(timer === 0){
      clearInterval(intervalId);
      setPlaying(false)
    }
    return () => clearInterval(intervalId);
    }
    
  }, [timer,playing]);

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
      {
        timer === 0 || playing === false ? <button onClick={playGame}>Play</button> : null
      }
    </div>
  );
}

export default App;
