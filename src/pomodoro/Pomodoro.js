import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration } from "../utils/duration/index";

import ProgressBar from "../utils/ProgressBar";
import SessionTitle from "../utils/SessionTitle";
import TimerCountdown from "../utils/TimerCountdown";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
/**
 * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
 */

function Pomodoro() {
  const session = {
    running: false,
    paused: false,
    stopped: true,
  };

  const [sessionState, setSessionState] = useState(session);
  const [onBreak, setOnBreak] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);
  const [disableButtons, setDisableButtons] = useState(false);
  const focusMinMax = [5, 60];
  const breakMinMax = [1, 15];

  // ToDo: Allow the user to adjust the focus and break duration.
  const startSession = () => {
    setSessionState({
      running: true,
      paused: false,
      stopped: false,
    });
  };

  const pauseSession = () => {
    setSessionState({
      running: false,
      paused: true,
      stopped: false,
    });
  };

  const stopSession = () => {
    setDisableButtons(false);
    setOnBreak(false);
    setTimeRemaining(0);
    setPercentComplete(0);
    setSessionState({
      running: false,
      paused: false,
      stopped: true,
    });
  };

  const handleIncrementClick = (type, increment) => {
    if (type === "focus") {
      const [min, max] = [...focusMinMax];
      const newDuration = focusDuration + increment;
      if (newDuration >= min && newDuration <= max) {
        setFocusDuration(newDuration);
      }
    } else if (type === "break") {
      const [min, max] = [...breakMinMax];
      const newDuration = breakDuration + increment;
      if (newDuration >= min && newDuration <= max) {
        setBreakDuration(newDuration);
      }
    }
  };

  const calculatePercentComplete = () => {
    if (onBreak) {
      const breakInSeconds = breakDuration * 60;
      setPercentComplete(
        Math.round(((breakInSeconds - timeRemaining) / breakInSeconds) * 100)
      );
    } else {
      const focusInSeconds = focusDuration * 60;
      setPercentComplete(
        Math.round(((focusInSeconds - timeRemaining) / focusInSeconds) * 100)
      );
    }
  };

  const playAudio = () => {
    const audio = document.getElementsByClassName("audio-element")[0];
    audio.play();
  };

  const toggleBreak = () => {
    playAudio();
    if (!onBreak) {
      setTimeRemaining(breakDuration * 60);
    } else {
      setTimeRemaining(focusDuration * 60);
    }
    setOnBreak((prevState) => !prevState);
    setPercentComplete(0);
  };

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(
    () => {
      if (timeRemaining === 0) {
        toggleBreak();
      } else {
        setTimeRemaining(timeRemaining - 1);
        calculatePercentComplete();
      }
    },
    sessionState.running ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  const playPause = () => {
    setDisableButtons(true);
    if (sessionState.running) {
      pauseSession();
    } else if (sessionState.paused) {
      startSession();
    } else if (sessionState.stopped) {
      startSession();
      setPercentComplete(0);
      if (onBreak) {
        setTimeRemaining(breakDuration * 60);
      } else {
        setTimeRemaining(focusDuration * 60);
      }
    }
  };

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <div className="alert alert-light alert-message float-left">
              Focus duration must be between {focusMinMax[0]} and{" "}
              {focusMinMax[1]} minutes
            </div>
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={() => handleIncrementClick("focus", -5)}
                disabled={focusDuration === focusMinMax[0] || disableButtons}
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={() => handleIncrementClick("focus", 5)}
                disabled={focusDuration === focusMinMax[1] || disableButtons}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="alert alert-light alert-message float-right">
            Break duration must be between {breakMinMax[0]} and {breakMinMax[1]}{" "}
            minutes
          </div>
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={() => handleIncrementClick("break", -1)}
                  disabled={breakDuration === breakMinMax[0] || disableButtons}
                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={() => handleIncrementClick("break", 1)}
                  disabled={breakDuration === breakMinMax[1] || disableButtons}
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
                  "oi-media-play": !sessionState.running,
                  "oi-media-pause": sessionState.running,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* TODO: Disable the stop button when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick={stopSession}
              disabled={sessionState.stopped}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <audio className="audio-element">
        <source src="https://bigsoundbank.com/UPLOAD/mp3/2117.mp3"></source>
      </audio>
      <div>
        {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
            <SessionTitle
              onBreak={onBreak}
              focusDuration={focusDuration}
              breakDuration={breakDuration}
              sessionState={sessionState}
            />
            {/* TODO: Update message below correctly format the time remaining in the current session */}
            <TimerCountdown
              sessionState={sessionState}
              timeRemaining={timeRemaining}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <ProgressBar
              percentComplete={percentComplete}
              sessionState={sessionState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
