import React from "react";
import PropTypes from "prop-types";
import Score from "react-score-indicator";
import creditIndicatorColors from "./creditIndicatorColors";

function CreditHealth({ creditScore }) {
  return (
    <div className="text-center box creditScore">
      <div className="frame-wrapper">
        <div className="frame">
          <h1 className="pt-2 pb-2">Credit Health</h1>
          <Score
            value={creditScore}
            maxValue={850}
            borderWith={100}
            gap={0}
            maxAngle={300}
            rotation={90}
            lineGap={2}
            stepsColors={creditIndicatorColors}
          />
          <h4 className="text-center">Recommendations</h4>
          {creditScore > 0 ? (
            <div className="pb-3 text-center">
              <p className="m-0">Continue to make on time payments</p>
              <p className="m-0">Using 30% or less of your credit line could improve your credit</p>
              <p className="m-0">You have a strong credit history</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

CreditHealth.propTypes = {
  creditScore: PropTypes.number.isRequired,
};

export default React.memo(CreditHealth);
