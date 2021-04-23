import React from "react";
import PropTypes from "prop-types";

export default function ProgressBar({ percentComplete, sessionState }) {
  return (
    <div>
      {!sessionState.stopped ? (
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            aria-label="Perent Complete"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={percentComplete} // TODO: Increase aria-valuenow as elapsed time increases
            style={{ width: `${percentComplete}%` }} // TODO: Increase width % as elapsed time increases
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

ProgressBar.propTypes = {
  percentComplete: PropTypes.number.isRequired,
};
