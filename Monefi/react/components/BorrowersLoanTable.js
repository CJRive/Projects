import React from "react";
import LoansTable from "./borrowerinfo/VerificationsTable";
import { Card } from "react-bootstrap";
import { AiOutlineEye } from "react-icons/ai";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import PropTypes from "prop-types";

function BorrowerLoanTable({
  clickedRow,
  loansList,
  handleLoanClick,
  onPageChange,
  currentPage,
  pageSize,
  loanTotalCount,
}) {
  const onLocalLoanClicked = (loan, index) => {
    handleLoanClick(loan, index);
  };

  const loansColumns = React.useMemo(
    () => [
      {
        Header: <div className="borrower-table-text ml-2">Type</div>,
        accessor: "loanType",
      },
      {
        Header: <div className="borrower-table-text">Status</div>,
        accessor: "statusType",
      },
      {
        Header: <div className="borrower-table-text">Loan Amount</div>,
        accessor: "loanAmount",
      },
      {
        Header: <div className="borrower-table-text">Loan Term</div>,
        accessor: "loanTerm",
      },
      {
        Header: <div className="borrower-table-text"></div>,
        accessor: "button",
        Cell: ({ row }) => {
          let isClicked = clickedRow.includes(row.index);
          return !isClicked ? (
            <AiOutlineEye
              title="View More"
              style={{ cursor: "pointer" }}
              size={30}
              color="#4AA6B2"
              onClick={() => {
                onLocalLoanClicked(row.original, row.index);
              }}
            />
          ) : (
            ""
          );
        },
      },
    ],
    [clickedRow]
  );
  return (
    <Card className="h-100">
      <Card.Header className="border-0">
        <div className="justify-content-between align-center d-flex">
          <h1 className="m-2">Active Loans</h1>

          <div className="pagination-container flex-grow-1 d-flex justify-content-end">
            <Pagination
              onChange={onPageChange}
              current={currentPage}
              pageSize={pageSize}
              showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
              total={loanTotalCount}
              locale={locale}
            />
          </div>
        </div>
      </Card.Header>
      <div className="borrower-table">
        <LoansTable columns={loansColumns} data={loansList} />
      </div>
    </Card>
  );
}
BorrowerLoanTable.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    isLoggedIn: PropTypes.bool,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
  loansList: PropTypes.arrayOf(
    PropTypes.shape({
      loanType: PropTypes.shape({}).isRequired,
      statusType: PropTypes.shape({}).isRequired,
      loanAmount: PropTypes.shape({}).isRequired,
      loanTerm: PropTypes.shape({}).isRequired,
    })
  ),
  loans: PropTypes.arrayOf(
    PropTypes.shape({
      loanType: PropTypes.shape({
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
      }),
      statusType: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
      loanAmount: PropTypes.number.isRequired,
      loanTerm: PropTypes.string.isRequired,
    })
  ),
  clickedRow: PropTypes.arrayOf(PropTypes.number),
  handleLoanClick: PropTypes.func,
  onPageChange: PropTypes.func,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  loanTotalCount: PropTypes.number.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    original: PropTypes.shape({
      loanType: PropTypes.string.isRequired,
      statusType: PropTypes.string.isRequired,
      loanAmount: PropTypes.number.isRequired,
      loanTerm: PropTypes.string.isRequired,
    }),
  }),
};
export default React.memo(BorrowerLoanTable);
