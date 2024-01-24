import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import DocumentsTable from "./borrowerinfo/UniversalTable";

function ApplicationDocumentsTable({ Universal }) {
  const documentsColumns = React.useMemo(
    () => [
      {
        Header: <div className="borrower-table-text ml-2">Type</div>,
        accessor: "verificationType",
      },
      {
        Header: <div className="borrower-table-text">Status</div>,
        accessor: "isVerified",
      },
      {
        Header: <div className="borrower-table-text">Results</div>,
        accessor: "isConfirmed",
      },
      {
        Header: <div className="borrower-table-text">Verified On</div>,
        accessor: "verifiedOn",
      },
      {
        Header: <div className="borrower-table-text">Comments</div>,
        accessor: "comment",
      },
    ],
    []
  );
  return (
    <Card className="h-100">
      <Card.Header className="border-0">
        <div className="justify-content-between align-center d-flex">
          <h1 className="m-2">Application Documents</h1>
          <Link to={`/borrower/verification`}>
            <div className="btn btn-sm btn-outline-white text-end">View More</div>
          </Link>
        </div>
      </Card.Header>
      <div className="borrower-table">
        <DocumentsTable columns={documentsColumns} data={Universal} />
      </div>
    </Card>
  );
}

ApplicationDocumentsTable.propTypes = {
  Universal: PropTypes.arrayOf(
    PropTypes.shape({
      verificationType: PropTypes.shape({}),
      isVerified: PropTypes.shape({}),
      isConfirmed: PropTypes.shape({}),
      verifiedOn: PropTypes.shape({}),
    })
  ),
};

export Universal React.memo(ApplicationDocumentsTable);
