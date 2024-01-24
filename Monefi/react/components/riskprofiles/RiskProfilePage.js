import React, { useState, useEffect } from "react";
import debug from "monefi-debug";
import { Card, Row, Col, Table } from "react-bootstrap";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import riskProfileService from "services/riskProfileService";
import RiskProfileListTemplate from "./RiskProfileListTemplate";
import "../riskprofiles/risk.css";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

function RiskProfilePage() {
  const _logger = debug.extend("RiskProfilePage");

  const [pageData, setPageData] = useState({
    riskProfileAr: [],
    riskProfileComponents: [],
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
    riskValue: "",
  });

  useEffect(() => {
    if (!pageData.riskValue) {
      riskProfileService
        .getAll(pageData.currentPage - 1, pageData.pageSize)
        .then(onGetRiskProfileSuccess)
        .catch(onGetRiskProfileError);
    } else {
      riskProfileService
        .getByRiskValue(pageData.currentPage - 1, pageData.pageSize, pageData.riskValue)
        .then(onSearchSuccess)
        .catch(onSearchError);
    }
  }, [pageData.currentPage]);

  const onPageChange = (page) => {
    setPageData((prevState) => {
      const newPage = { ...prevState };
      newPage.currentPage = page;
      return newPage;
    });
  };

  const mapSingleProfile = (riskProfile) => {
    _logger("Risk Profiles", riskProfile.id);
    return (
      <RiskProfileListTemplate key={"RiskProfile" + riskProfile.id} riskProfile={riskProfile} />
    );
  };

  const onGetRiskProfileSuccess = (response) => {
    _logger("Success", response);
    setPageData((prevState) => {
      const newResult = { ...prevState };
      newResult.totalCount = response.item.totalCount;
      newResult.riskProfileAr = response.item.pagedItems;
      newResult.riskProfileComponents = newResult.riskProfileAr.map(mapSingleProfile);
      return newResult;
    });
  };

  const onGetRiskProfileError = (error) => {
    _logger("Success", error);
  };

  const onSearchChange = (evt) => {
    const targetValue = evt.target.value;
    _logger("onChange", targetValue);
    setPageData((prevState) => {
      const newSearch = { ...prevState };

      newSearch.riskValue = targetValue;

      if (targetValue === "") {
        newSearch.currentPage = 1;

        if (pageData.currentPage === 1) {
          riskProfileService
            .getAll(pageData.currentPage - 1, pageData.pageSize)
            .then(onGetRiskProfileSuccess)
            .catch(onGetRiskProfileError);
        }
      } else {
        newSearch.currentPage = 1;

        onSearchRange(newSearch.riskValue);
      }

      return newSearch;
    });
  };

  const onSearchRange = (searchRange) => {
    setPageData((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    if (pageData.currentPage === 1) {
      riskProfileService
        .getByRiskValue(pageData.currentPage - 1, pageData.pageSize, searchRange)
        .then(onSearchSuccess)
        .catch(onSearchError);
    }
  };

  const onSearchSuccess = (response) => {
    _logger("Search response", response);
    const searchAr = response.item;

    setPageData((prevState) => {
      const newSearch = { ...prevState };
      newSearch.riskProfileComponents = searchAr.pagedItems.map(mapSingleProfile);
      newSearch.totalCount = searchAr.totalCount;
      return newSearch;
    });
  };

  const onSearchError = (error) => {
    _logger("Unable to find records within that range", error);
    toastr.error(error.response.data.errors);
  };

  return (
    <>
      <Card className="border-0">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h3 className="mb-0">Borrower Risk Profiles</h3>
              <p className="mb-0">
                Quickly retrieve detailed information about individuals Risk Profiles
              </p>
            </div>
            <div className="flex-grow-1 d-flex justify-content-end">
              <form className="d-flex" role="search">
                <input
                  type="select"
                  className="form-control me-2"
                  id="riskValue"
                  placeholder="Search"
                  aria-label="Search"
                  name="riskValue"
                />
                <select
                  onChange={onSearchChange}
                  value={pageData.riskValue}
                  className="form-select text-dark me-5"
                >
                  <option value="">Select Filter</option>
                  <option value="1-40">High-Risk Borrower</option>
                  <option value="41-70">Moderate-Risk Borrower</option>
                  <option value="71-100">Low-Risk Borrower</option>
                </select>
              </form>
            </div>
          </div>
          <div className="pagination-container flex-grow-1 d-flex justify-content-end">
            <Pagination
              onChange={onPageChange}
              current={pageData.currentPage}
              pageSize={pageData.pageSize}
              showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
              total={pageData.totalCount}
              locale={locale}
            />
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div className="risk-profile table-responsive ">
                <Table className="text-nowrap text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Applicant</th>
                      <th>Amount</th>
                      <th>Total Risk Value</th>
                      <th>Risk Assessment</th>
                      <th>Credit Score</th>
                      <th>Time In Business</th>
                      <th>Annual Revenue</th>
                      <th>Debt to Income Ratio</th>
                      <th>Collateral</th>
                      <th>Status</th>
                      <th>{}</th>
                    </tr>
                    <tr>
                      <th colSpan="5"></th>
                      <th>{}</th>
                      <th>{}</th>
                      <th>{}</th>
                      <th>{}</th>
                      <th>{}</th>
                      <th>{}</th>
                    </tr>
                  </thead>
                  {pageData.riskProfileComponents}
                </Table>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default React.memo(RiskProfilePage);
