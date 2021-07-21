import React from "react";
import classNames from "../utils/class-names";
import secondsToDuration, {minutesToDuration} from "../utils/duration";
import Logic from "../pomodoro/PomodoroLogic"


function Pomodoro() {
  // Destructure our logic function so we have access to the individual functions
  const { decrease, increase, stop, getValueNow, getWidth, focusDuration, breakDuration, session, isTimerRunning, playPause } = Logic()

  // Timer starts out paused
  


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