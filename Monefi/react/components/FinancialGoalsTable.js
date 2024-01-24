import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import GoalsTable from "./borrowerinfo/DefaultTable";

function FinancialGoalsTable({ goals }) {
  const goalsColumns = React.useMemo(
    () => [
      {
        Header: <div className="borrower-table-text ml-2">Goal Type</div>,
        accessor: "goalType",
      },
      {
        Header: <div className="borrower-table-text">Name</div>,
        accessor: "name",
      },
      {
        Header: <div className="borrower-table-text">Description</div>,
        accessor: "description",
      },
      {
        Header: <div className="borrower-table-text">Target Date</div>,
        accessor: "targetDate",
      },
    ],
    []
  );
  return (
    <Card className="h-100">
      <Card.Header className="border-0">
        <div className="justify-content-between align-center d-flex">
          <h1 className="m-2">Financial Goals</h1>
          <Link to={"/goals"}>
            <div className="btn btn-sm btn-outline-white fs-6">View More</div>
          </Link>
        </div>
      </Card.Header>
      <div className="borrower-table">
        <GoalsTable columns={goalsColumns} data={goals} />
      </div>
    </Card>
  );
}

FinancialGoalsTable.propTypes = {
  goals: PropTypes.arrayOf(
    PropTypes.shape({
      goalType: PropTypes.shape({}),
      name: PropTypes.shape({}),
      targetDate: PropTypes.shape({}),
    })
  ),
};

export default React.memo(FinancialGoalsTable);
