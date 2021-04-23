import React from "react";
import { minutesToDuration } from "../utils/duration/index";

export default function SessionTitle({
  onBreak,
  focusDuration,
  breakDuration,
  sessionState,
}) {
  return (
    <div>
      <section>
        {!sessionState.stopped ? (
          <div>
            <h2 data-testid="session-title">
              {onBreak ? "On Break" : "Focusing"} for{" "}
              {onBreak
                ? minutesToDuration(breakDuration)
                : minutesToDuration(focusDuration)}{" "}
              minutes
            </h2>
            <h2>{sessionState.paused ? "Paused" : ""}</h2>{" "}
          </div>
        ) : (
          ""
        )}
      </section>
    </div>
  );
}
