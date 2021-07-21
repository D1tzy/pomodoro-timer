import React from 'react'
import { minutesToDuration } from '../duration'
import classNames from '../class-names'

export default function Buttons({increase, decrease, stop, playPause, breakDuration, focusDuration, session, isTimerRunning}) {


    return (
    <article>
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
  </article>
    );
}