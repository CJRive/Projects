import React from "react";
import { Image } from "react-bootstrap";
import PropTypes from "prop-types";
import { Dropdown } from "react-bootstrap";
import CustomToggle from "../riskprofiles/CustomToggle";
import { useNavigate } from "react-router-dom";
import "../riskprofiles/risk.css";
import { IoIosRadioButtonOn } from "react-icons/io";

function RiskProfileListTemplate(props) {
  const aRiskProfile = props.riskProfile;
  const navigate = useNavigate();

  const onLocalEditClicked = () => {
    const stateForTransport = { type: "RISK_TYPE", risk: aRiskProfile };
    navigate(`/riskprofiles/${aRiskProfile.id}`, {
      state: stateForTransport,
    });
  };

  return (
    <React.Fragment>
      <tbody>
        <tr className="risk-profile">
          <td>
            <div className="text-center row">
              <div className="col-2">
                <Image
                  src={aRiskProfile.user?.avatarUrl}
                  alt="user image"
                  className="rounded-circle avatar-sm mb-3"
                  style={{ objectFit: "cover" }}
                />{" "}
              </div>
              <div className="mt-2 col-2">
                {aRiskProfile.user?.firstName}{" "}
                {aRiskProfile.user?.lastName}
              </div>
            </div>
          </td>
          <td>{`${aRiskProfile.amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}`}</td>
          <td>{aRiskProfile.totalRiskValue}</td>
          <td>
            {aRiskProfile.totalRiskValue <= 40 && `High-Risk Borrower`}
            {aRiskProfile.totalRiskValue >= 41 &&
              aRiskProfile.totalRiskValue <= 70 &&
              `Moderate-Risk Borrower`}
            {aRiskProfile.totalRiskValue >= 71 && `Low-Risk Borrower`}
          </td>
          <td>{aRiskProfile.scoreCard.creditScore.description}</td>
          <td>{aRiskProfile.scoreCard.timeInBusiness.description}</td>
          <td>{aRiskProfile.scoreCard.annualRevenue.description}</td>
          <td>{aRiskProfile.scoreCard.debtToIncomeRatio.description}</td>
          <td>{aRiskProfile.scoreCard.collateral.description}</td>
          <td>
            {aRiskProfile.statusType.name === "Approved" && (
              <IoIosRadioButtonOn color="green" title="Approved" />
            )}
            {aRiskProfile.statusType.name === "Denied" && (
              <IoIosRadioButtonOn color="red" title="Denied" />
            )}
            {aRiskProfile.statusType.name === "Needs Follow Up" && (
              <IoIosRadioButtonOn color="Orange" title="Needs Follow Up" />
            )}
          </td>
          <td>
            <Dropdown drop="down">
              <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={onLocalEditClicked}>
                  View More
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </tr>
      </tbody>
    </React.Fragment>
  );
}

RiskProfileListTemplate.propTypes = {
  riskProfile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    amount: PropTypes.number,
    scoreCard: PropTypes.shape({
      creditScore: PropTypes.shape({
        description: PropTypes.string.isRequired,
      }).isRequired,
      timeInBusiness: PropTypes.shape({
        description: PropTypes.string.isRequired,
      }).isRequired,
      annualRevenue: PropTypes.shape({
        description: PropTypes.string.isRequired,
      }).isRequired,
      debtToIncomeRatio: PropTypes.shape({
        description: PropTypes.string.isRequired,
      }).isRequired,
      collateral: PropTypes.shape({
        description: PropTypes.string.isRequired,
      }).isRequired,
    }),
    statusType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    totalRiskValue: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string,
      avatarUrl: PropTypes.string.isRequired,
    }),
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string,
  }).isRequired,
};

export default React.memo(RiskProfileListTemplate);
