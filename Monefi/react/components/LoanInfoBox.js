import React from "react";
import PropTypes from "prop-types";
import debug from "monefi-debug";

const _logger = debug.extend("BorrowersLoans");

function LoanInfoBox({ selectedLoan, loans }) {
  _logger("loans Details", selectedLoan);
  return (
    <div className="text-center">
      <div className="row">
        <div className="col-3 col-sm-3 position-relative">
          <h3 className="text-secondary mt-1">
            <span className="d-block">Loan Amount</span>
          </h3>
          <h1 className="mt-4">
            <span className="d-block">
              {!selectedLoan
                ? loans[0]?.loanAmount?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                : selectedLoan?.loanAmount?.props.children.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
            </span>
          </h1>
        </div>
        <div className="col-3 col-sm-3 position-relative">
          <h3 className="text-secondary mt-1">Interest Rate</h3>
          <h1 className="mt-4">
            {loans.length > 0 && !selectedLoan
              ? `${loans[0]?.preferredInterestRate}%`
              : selectedLoan
              ? `${selectedLoan.preferredInterestRate}%`
              : null}
          </h1>
        </div>
        <div className="col-3 col-sm-3 position-relative">
          <h3 className="text-secondary mt-1">Term</h3>
          <h1 className="mt-4">
            {!selectedLoan ? loans[0]?.loanTerm : selectedLoan.loanTerm.props.children}
          </h1>
        </div>
        <div className="col-3 col-sm-3 ">
          <h3 className="text-secondary mt-1">Status</h3>
          <h1 className="mt-4">
            {!selectedLoan ? loans[0]?.statusType.name : selectedLoan.statusType.props.children}
          </h1>
        </div>
      </div>
    </div>
  );
}

LoanInfoBox.propTypes = {
  selectedLoan: PropTypes.shape({
    loanAmount: PropTypes.shape({
      props: PropTypes.shape({
        children: PropTypes.string,
      }),
    }),
    loanTerm: PropTypes.shape({
      props: PropTypes.shape({
        children: PropTypes.string,
      }),
    }),
    preferredInterestRate: PropTypes.number,
    statusType: PropTypes.shape({
      props: PropTypes.shape({
        children: PropTypes.string,
      }),
    }),
  }),
  loans: PropTypes.arrayOf(
    PropTypes.shape({
      preferredInterestRate: PropTypes.number.isRequired,
      statusType: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
      loanAmount: PropTypes.number.isRequired,
      loanTerm: PropTypes.string.isRequired,
    })
  ),
};

export default React.memo(LoanInfoBox);
