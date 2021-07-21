import { useState } from "react";
import useInterval from "../utils/useInterval";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
 function nextTick(prevState) {
    const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
    return {
      ...prevState,
      timeRemaining,
    };
  }
  
  
  
  /**
   * Higher order function that returns a function to update the session state with the next session type upon timeout.
   * @param focusDuration
   *    the current focus duration
   * @param breakDuration
   *    the current break duration
   * @returns
   *  function to update the session state.
   */
  function nextSession(focusDuration, breakDuration) {
    /**
     * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
     */
    return (currentSession) => {
      if (currentSession.label === "Focusing") {
        return {
          label: "On Break",
          timeRemaining: breakDuration * 60,
        };
      }
      return {
        label: "Focusing",
        timeRemaining: focusDuration * 60,
      };
    };
  }
  

// ALL THE LOGIC FOR POMODORO
export default function Logic() {
    const [focusDuration, setFocusDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);

    // has a LABEL and a timeRemaining value
    const [session, setSession] = useState(null);

    const [isTimerRunning, setIsTimerRunning] = useState(false);

  

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
   useInterval(() => {
    if (session.timeRemaining === 0) {
      new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
      return setSession(nextSession(focusDuration, breakDuration));
    }
    return setSession(nextTick);
  },
  isTimerRunning ? 1000 : null
);

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
    }

  
    function decrease(event) {
      const testId = event.target.dataset.testid
      
      if(!isTimerRunning) {
        if (testId === 'decrease-break' && breakDuration - 1 >= 1) {
          setBreakDuration(breakDuration - 1) 
        } else if (testId === 'decrease-focus' && focusDuration - 5 >= 5) {
          setFocusDuration(focusDuration - 5)
        }
      }
    }
  
    function increase(event) {
      const testId = event.target.dataset.testid
  
      if(!isTimerRunning) {
        if (testId === 'increase-break' && breakDuration + 1 <= 15) {
          setBreakDuration(breakDuration + 1) 
        } else if (testId === 'increase-focus' && focusDuration + 5 <= 60) {
          setFocusDuration(focusDuration + 5)
        }
      }
    }
  
    function stop() {
      setSession(null)
      setIsTimerRunning(false)
    }
  
    
  
    function getWidth() {
      if (!session) return 0;
  
      if (session.label === "Focusing") {
        return `${100 - (session.timeRemaining / (focusDuration * 60) * 100)}%`
      } else {
        return `${100 - (session.timeRemaining / (breakDuration * 60) * 100)}%`
      }
    }
    
    function getValueNow() {
      if (!session) return 0;
  
      if (session.label === "Focusing") {
        return (100 - (session.timeRemaining / (focusDuration * 60) * 100))
      } else {
        return (100 - (session.timeRemaining / (breakDuration * 60) * 100))
      }
    }

    return {decrease, increase, getValueNow, getWidth, stop, playPause, nextTick, nextSession, useInterval, focusDuration, breakDuration, session, isTimerRunning}
}