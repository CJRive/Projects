import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import debug from "sabio-debug";
import dashBoardsService from "../../../services/dashboardService";
import toastr from "toastr";
import { formatDateTime } from "utils/dateFormater";
import PropTypes from "prop-types";
import "./borrowerdashboard.css";
import BorrowersLoanTable from "./BorrowersLoanTable";
import LoanInfoBox from "./LoanInfoBox";
import ApplicationDocumentsTable from "./ApplicationDocumentsTable";
import FinancialGoalsTable from "./FinancialGoalsTable";
import LoanCalculator from "components/loan/loanscalculator/LoanCalculator";
import CreditHealth from "./CreditHealth";
import loanAppsService from "services/loanApplicationsService";
import BalanceAndPayments from "./BalanceAndPayments";

const _logger = debug.extend("BorrowersDash");

function BorrowersDashboard(props) {
  const navigate = useNavigate();
  const [bData, setBData] = useState({
    loansData: [],
    loansList: [],
    goalsData: [],
    verificationData: [],
    creditScore: 0,
    pageSize: 5,
    currentPage: 1,
    loanTotalCount: 0,
    selectedLoan: null,
    clickedRow: [0],
  });

  useEffect(() => {
    dashBoardsService.getBorrowersUI(0, 5).then(onGetUISuccess).catch(onGetUIError);
  }, [props.currentUser]);

  useEffect(() => {
    loanAppsService
      .getCurrentPaged(bData.currentPage - 1, bData.pageSize)
      .then(onGetLoanDataSuccess)
      .catch(onGetUIError);
  }, [bData.currentPage]);

  const onGetLoanDataSuccess = (response) => {
    _logger(response, "LOAN CALL");
    setBData((prevState) => ({
      ...prevState,
      loansList: response.item.pagedItems?.map(mapLoanList),
    }));
    setBData((prevState) => ({
      ...prevState,
      loanTotalCount: response.item.totalCount,
    }));
  };

  const onGetUISuccess = (response) => {
    setBData((prevState) => {
      let uiData = { ...prevState };
      _logger(response, "UI RESPONSE");
      if (response.item.riskProfile !== null) {
        uiData.creditScore = parseInt(response.item.riskProfile.scoreCard.creditScore.description);
      } else {
        toastr.info("Please Create a Risk Profile");
        navigate("/riskprofiles/new");
      }

      if (response.item.loanApplications !== null) {
        uiData.loantTotalCount = response.item.loanApplications.totalCount;
        uiData.loansData = response.item.loanApplications?.pagedItems;
        uiData.loansList = response.item.loanApplications.pagedItems?.map(mapLoanList);
      } else {
        toastr.info("You have no active loan application");
      }

      if (response.item.goals !== null) {
        uiData.goalsData = response.item.goals.pagedItems.map((goal) => {
          return {
            goalType: <div className="borrower-cell-text">{goal.goalType.name}</div>,
            name: <div className="borrower-cell-text">{goal.name}</div>,
            description: (
              <div className="borrower-cell-text">{`${goal.description.slice(0, 20)}...`}</div>
            ),
            targetDate: <div className="borrower-cell-text">{formatDateTime(goal.targetDate)}</div>,
          };
        });
      }

      if (response.item.borrowerVerification !== null) {
        uiData.verificationData = response.item.borrowerVerifications?.map((verification) => {
          return {
            verificationType: (
              <div className="borrower-cell-text">{verification.verificationType.name}</div>
            ),
            isConfirmed:
              verification.isConfirmed === true ? (
                <div className="borrower-cell-text">Passed</div>
              ) : (
                <div className="borrower-cell-text">Passed</div>
              ),
            verifiedOn:
              verification.isVerified === false ? (
                <div className="borrower-cell-text">Not Verified</div>
              ) : (
                <div className="borrower-cell-text">
                  {formatDateTime(verification.dateModified)}
                </div>
              ),
            isVerified:
              verification.verificationStatusId === 1 ? (
                <div className="borrower-cell-text status-pending">Pending</div>
              ) : verification.verificationStatusId === 2 ? (
                <div className="borrower-cell-text status-completed">Completed</div>
              ) : verification.verificationStatusId === 3 ? (
                <div className="borrower-cell-text status-rejected">Rejected</div>
              ) : (
                <div className="borrower-cell-text status-incomplete">Incomplete</div>
              ),
            comment: <div className="borrower-cell-text">{verification.comment}</div>,
          };
        });
      }

      _logger("From get UI Success", response);

      return uiData;
    });
  };

  const onGetUIError = (error) => {
    _logger("get DashboardUI error", error);
  };

  const mapLoanList = (loan) => {
    return {
      loanType: <div className="borrower-cell-text">{loan.loanType.name}</div>,
      statusType: <div className="borrower-cell-text">{loan.statusType.name}</div>,
      loanAmount: (
        <div className="borrower-cell-text">
          {loan.loanAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      ),
      loanTerm: <div className="borrower-cell-text">{loan.loanTerm}</div>,
      preferredInterestRate: loan.preferredInterestRate,
    };
  };

  const handleLoanClick = (loan, index) => {
    setBData((prevState) => ({
      ...prevState,
      selectedLoan: loan,
      clickedRow: [index],
    }));
    _logger(bData.selectedLoan, "selected loan");
  };

  const onPageChange = (page) => {
    setBData((prevState) => {
      const newPage = { ...prevState };
      newPage.currentPage = page;
      return newPage;
    });
  };

  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="div">
          <div className="container-fluid">
            <div className="box loan-info ">
              <div className="rectangle-wrapper">
                <div className="rectangle d-flex flex-column justify-content-center ">
                  <LoanInfoBox selectedLoan={bData.selectedLoan} loans={bData.loansData} />
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-8 mt-5">
                <div className="box-container">
                  <div className="box loan-table">
                    <div className="rectangle-wrapper">
                      <div className="rectangle">
                        <BorrowersLoanTable
                          loansList={bData.loansList}
                          clickedRow={bData.clickedRow}
                          handleLoanClick={handleLoanClick}
                          onPageChange={onPageChange}
                          currentPage={bData.currentPage}
                          pageSize={bData.pageSize}
                          loanTotalCount={bData.loanTotalCount}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="box application-documents">
                    <div className="rectangle-wrapper">
                      <div className="rectangle">
                        <ApplicationDocumentsTable verifications={bData.verificationData} />
                      </div>
                    </div>
                  </div>
                  <div className="box financial-goals">
                    <div className="rectangle-wrapper">
                      <div className="rectangle">
                        <FinancialGoalsTable goals={bData.goalsData} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 box-container col-lg-4 col-md-12 ">
                <div className="text-center box payments">
                  <div className="frame-wrapper">
                    <div className="frame">
                      <BalanceAndPayments
                        loansData={bData.loansData}
                        selectedLoan={bData.selectedLoan}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center box creditScore">
                  <div className="frame-wrapper">
                    <div className="frame">
                      <CreditHealth creditScore={bData.creditScore} />
                    </div>
                  </div>
                </div>
                <div className="text-center box calculator mb-2">
                  <div className="frame-wrapper">
                    <div className="frame">
                      <div className="">
                        <LoanCalculator />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

BorrowersDashboard.propTypes = {
  currentUser: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default React.memo(BorrowersDashboard);
