import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import secondsToDuration, {minutesToDuration} from "../utils/duration";

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

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // has a LABEL and a timeRemaining value
  const [session, setSession] = useState(null);


  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

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


  return (
    <div className="pomodoro">

      {/*focus area*/}
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={decrease}
                disabled={session ? true: false}
              >
                {/*text for the button*/}
                <span className="oi oi-minus" />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={increase}
                disabled={session ? true: false}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>


        {/*breakduration area*/}
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={decrease}
                  disabled={session ? true: false}
                >
                  <span className="oi oi-minus" />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={increase}
                  disabled={session ? true: false}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*timer control*/}
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick={stop}
              disabled={session ? false: true}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      
      {session != null &&
      <div>
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
            <h2 data-testid="session-title">
              {session.label === "Focusing" ? `Focusing for ${minutesToDuration(focusDuration)}` : `On Break for ${minutesToDuration(breakDuration)}`} minutes
            </h2>
            
            <p className="lead" data-testid="session-sub-title">
              {session != null ? secondsToDuration(session.timeRemaining) : "00:00"} remaining
            </p>
            {session != null && !isTimerRunning && <h2>PAUSED</h2>}
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={getValueNow} // TODO: Increase aria-valuenow as elapsed time increases
                style={{ width: getWidth() }} // TODO: Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default Pomodoro;