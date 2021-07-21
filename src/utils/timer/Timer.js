import React from 'react'
import secondsToDuration, { minutesToDuration } from '../duration'

export default function Timer({ getWidth, getValueNow, session, breakDuration, focusDuration, isTimerRunning }) {

    return (
        <article>
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
        </article>
    )
}