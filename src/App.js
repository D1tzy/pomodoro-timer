import React from "react";
import "./App.css";
import Pomodoro from "./pomodoro/Pomodoro";

function Header() {
  return <h1>Pomodoro Timer</h1>
}

function App() {
  return (
    <div className="App">
      <header className="App-header container">
        <Header />
      </header>
      <div className="container">
        <Pomodoro />
      </div>
    </div>
  );
}

export default App;
