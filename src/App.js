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

  function playGame(){
    setTimer(5)
    setPlaying(true)
    console.log(playing)
  }

  useEffect(() => {
    if (shouldRun.current) {
      getWord();
      shouldRun.current = false;
    }
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
    console.log(playing)
  
    
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
