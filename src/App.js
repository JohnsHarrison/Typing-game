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
  const [health,setHealth] = useState(100)
  const [difficulty, setDifficulty] = useState("") 

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
    if(playing === false){
      event.preventDefault()
    }

    if (event.key !== word[index]) {
      event.preventDefault();
      if(health > 0){
        setHealth(health - 10)
      }
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
      setTimer(()=> difficulty === "easy" ? timer + 5 : difficulty === "medium" ? timer + 3 : difficulty === "hard" ? timer + 1 : null);
      event.target.value = "";
    }
  }

  // function for setInterval
  function countDown(time) {
    setTimer(time - 1);
  }

  //handles setting the timer and changes the state of playing
  function playGame(){
    setTimer(()=> difficulty === "easy" ? 60 : difficulty === "medium" ? 30 : difficulty === "hard" ? 10 : null)
    setHealth(100)
    setPlaying(true)
    setScore(0)
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

    if(timer === 0 || health === 0){
      clearInterval(intervalId);
      setPlaying(false)
    }
    return () => clearInterval(intervalId);
    }

    if(health === 0){
      setPlaying(false)
    }

  }, [timer,playing,health]);

  return (
    <div className="App">
      {/* buttons to select difficulty */}
      {
        !playing ? <div style={{display:"flex",alignItems:"center"}}>
                      <h1>Difficulty</h1>
                      <button onClick={(()=>setDifficulty("easy"))}>easy</button>
                      <button onClick={(()=>setDifficulty("medium"))}>medium</button>
                      <button onClick={(()=>setDifficulty("hard"))}>hard</button>
                    </div>: null
      }

      {/* displays current selected difficulty */}
      {
        difficulty === ""  && playing === false ? null : <h1>Current difficulty {difficulty === "" ? "?" : difficulty}</h1>
      }

      {/* displays game */}
      {
        playing ? <div> 
                    <h1>current health {health}</h1>
                    <h1>timer: {timer}</h1>
                    <h1>{word}</h1>
                    <input
                      onKeyDown={checkLetter}
                      onChange={handleChange}
                      spellCheck="false"
                    />
                    <h1>{inputText}</h1>
                    <h1>score: {score}</h1>
                    
                  </div> : null
      }

      {/* displays play game button  */}
      {
        difficulty !== "" && playing === false ? <button onClick={playGame}>Play</button> : null
      }
      
      
    </div>
  );
}

export default App;
