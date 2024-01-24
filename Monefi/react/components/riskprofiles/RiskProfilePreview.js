import React, { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import "../riskprofiles/risk.css";
import PropTypes from "prop-types";
import debug from "monefi-debug";

function RiskProfilePreview({
  currentUser,
  user,
  riskTypes,
  preview,
  isEditing,
}) {
  const _logger = debug.extend("RisksPreview");
  const [totalPoints, setTotalPoints] = useState(null);
  _logger(totalPoints);

  const getPointsById = (id) => {
    const record = riskTypes.find((item) =>
      item.riskTypeValues.some((value) => value.id === id)
    );
    return record
      ? record.riskTypeValues.find((item) => item.id === id).points
      : 0;
  };

  const calculateTotalPoints = () => {
    const pointFields = [
      "timeInBusiness",
      "annualRevenue",
      "debtToIncomeRatio",
      "collateral",
    ];
    let points = 0;

    pointFields.forEach((field) => {
      const entityId = preview[field].entityId;
      const defaultEntityId = preview[`${field}Default`].entityId;
      const fieldPoints = getPointsById(parseInt(entityId)) || 0;
      const defaultPoints = getPointsById(parseInt(defaultEntityId)) || 0;

      if (!currentUser.roles.includes("Admin", "Merchant")) {
        points += defaultPoints;
      } else {
        points += fieldPoints;
      }
    });

    const creditScorePoints =
      getPointsById(parseInt(preview.creditScore.entityId)) || 0;
    // if (!currentUser.roles.includes("Admin", "Merchant")) {
    points += creditScorePoints;
    // }

    return points;
  };

  useEffect(() => {
    setTotalPoints(calculateTotalPoints());
  }, [preview, calculateTotalPoints]);

  const getLabelString = (entity, label, ranges, useDefault = false) => {
    const entityId = useDefault
      ? preview[`${entity}Default`].entityId
      : preview[entity].entityId;

    const points = getPointsById(parseInt(entityId));
    let labelString = label;
    ranges.forEach((range) => {
      if (entityId >= range.min && entityId <= range.max) {
        labelString += range.text;
      }
    });
    labelString += ` (${points})`;
    return <strong>{labelString}</strong>;
  };

  const getRiskCategory = () => {
    if (totalPoints <= 40) {
      return `High-Risk Borrower (Score: ${totalPoints})`;
    } else if (totalPoints >= 41 && totalPoints <= 70) {
      return `Moderate-Risk Borrower (Score: ${totalPoints})`;
    } else {
      return `Low-Risk Borrower (Score: ${totalPoints})`;
    }
  };

  return (
    <Col lg={6} md={6} sm={12}>
      <div className="justify-content-center align-items-center">
        <div
          className="form-group card container mt-4 risk-gradient-border shadow-lg rounded pb-2 mb-2 p-4 bg-white"
          style={{ maxWidth: "500px" }}
        >
          <h2 className="preview text-center">Score Card</h2>
          <div className="text-center mb-2 ">
            <img
              className="rounded-circle"
              src={isEditing ? user.avatarUrl : currentUser.avatarUrl}
              alt=""
              style={{ width: "125px", height: "125px" }}
            />
          </div>
          <h3 className="mb-2 text-center">
            {isEditing
              ? `${user.firstName} ${user.lastName}`
              : `${currentUser.firstName} ${currentUser.lastName}`}
          </h3>
          <h3>{getRiskCategory()}</h3>
          <ul>
            <li>
              {getLabelString("creditScore", "Credit Score", [
                { min: 1, max: 15, text: " Poor" },
                { min: 16, max: 25, text: " Fair" },
                { min: 26, max: Infinity, text: " Excellent" },
              ])}
            </li>
            <li>
              {getLabelString(
                "timeInBusiness",
                "Time In Business",
                [
                  { min: 37, max: 41, text: ": Less than 6 months" },
                  { min: 42, max: 46, text: ": 6 months" },
                  { min: 47, max: 51, text: ": 1-3 years" },
                  { min: 52, max: 56, text: ": More than 3 years" },
                ],
                !currentUser.roles.includes("Admin", "Merchant")
              )}
            </li>
            <li>
              {getLabelString(
                "annualRevenue",
                "Annual Revenue",
                [
                  { min: 57, max: 61, text: ": Less than $50,000" },
                  { min: 62, max: 66, text: ": $50,000 - $250,000" },
                  { min: 67, max: 71, text: ": $250,000 - $500,000" },
                  { min: 72, max: 76, text: ": More than $500,000" },
                ],
                !currentUser.roles.includes("Admin", "Merchant")
              )}
            </li>
            <li>
              {getLabelString(
                "debtToIncomeRatio",
                "Debt To Income Ratio",
                [
                  { min: 77, max: 81, text: ": Greater than 50%" },
                  { min: 82, max: 86, text: ": 30% - 50%" },
                  { min: 87, max: 91, text: ": Less than 30%" },
                ],
                !currentUser.roles.includes("Admin", "Merchant")
              )}
            </li>
            <li>
              {getLabelString(
                "collateral",
                "Collateral",
                [
                  { min: 92, max: 94, text: ": No Collateral" },
                  { min: 95, max: 97, text: ": Partial Collateral" },
                  { min: 98, max: 101, text: ": Full Collateral" },
                ],
                !currentUser.roles.includes("Admin", "Merchant")
              )}
            </li>
          </ul>
        </div>
      </div>
    </Col>
  );
}

RiskProfilePreview.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    email: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
  riskTypes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  preview: PropTypes.shape({
    creditScore: PropTypes.shape({
      entityId: PropTypes.string.isRequired,
    }).isRequired,
    timeInBusiness: PropTypes.shape({
      entityId: PropTypes.string.isRequired,
    }).isRequired,
    annualRevenue: PropTypes.shape({
      entityId: PropTypes.string.isRequired,
    }).isRequired,
    debtToIncomeRatio: PropTypes.shape({
      entityId: PropTypes.string.isRequired,
    }).isRequired,
    collateral: PropTypes.shape({
      entityId: PropTypes.string.isRequired,
    }).isRequired,
    timeInBusinessDefault: PropTypes.shape({
      entityId: PropTypes.string.isRequired,
    }).isRequired,
    annualRevenueDefault: PropTypes.shape({
      entityId: PropTypes.string.isRequired,
    }).isRequired,
    debtToIncomeRatioDefault: PropTypes.shape({
      entityId: PropTypes.string.isRequired,
    }).isRequired,
    collateralDefault: PropTypes.shape({
      entityId: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  isEditing: PropTypes.bool,
};

export default React.memo(RiskProfilePreview);
