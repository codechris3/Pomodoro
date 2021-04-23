import React from "react";
import secondsToDuration from "../utils/duration/index";

export default function TimerCountdown({ sessionState, timeRemaining }) {
  return (
    <div>
      {!sessionState.stopped ? (
        <p className="lead" data-testid="session-sub-title">
          {secondsToDuration(timeRemaining)} remaining
        </p>
      ) : (
        ""
      )}{" "}
    </div>
  );
}
