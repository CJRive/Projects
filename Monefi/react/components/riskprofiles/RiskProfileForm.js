import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import lookUpService from "services/lookUpService";
import { riskProfileFormSchema, riskProfileDefaultFormSchema } from "schemas/riskProfileFormSchema";
import riskProfileService from "services/riskProfileService";
import RiskProfilePreview from "./RiskProfilePreview";
import "../riskprofiles/risk.css";

function RiskProfileForm(props) {
  const _logger = debug.extend("RisksForm");
  const roles = props.currentUser.roles;
  const navigate = useNavigate();

  const { state } = useLocation();

  const [riskFormData, setRiskFormData] = useState({
    amount: "",
    statusTypeId: 1,
    creditScore: { entityId: "" },
    timeInBusiness: { entityId: "" },
    annualRevenue: { entityId: "" },
    debtToIncomeRatio: { entityId: "" },
    collateral: { entityId: "" },
    timeInBusinessDefault: { entityId: "" },
    annualRevenueDefault: { entityId: "" },
    debtToIncomeRatioDefault: { entityId: "" },
    collateralDefault: { entityId: "" },
    userId: props.currentUser.id,
    user: {},
    isEditing: false,
  });

  const [riskTypes, setRiskTypes] = useState({
    allRiskTypes: [],
    creditScoresComponents: [],
    timeinBusinessComponents: [],
    annualRevenueComponents: [],
    debtToIncomeRatioComponents: [],
    collateralComponents: [],
    statusTypesComponents: [],
  });

  useEffect(() => {
    riskProfileService.getAllRiskTypes().then(onGetTypesSuccess).catch(onErrorGetTypes);

    lookUpService
      .getTypes(["RiskStatusTypes"])
      .then(onGetStatusTypesSuccess)
      .catch(onErrorGetTypes);
  }, []);

  const onGetStatusTypesSuccess = (response) => {
    _logger(response, "StatusTypes");
    const types = response.item;

    setRiskTypes((prevState) => {
      return {
        ...prevState,
        statusTypesComponents: types.riskStatusTypes.map(mapStatusTypes),
      };
    });
  };

  const onGetTypesSuccess = (response) => {
    _logger(response, "RiskTypes");
    const types = response.item;

    setRiskTypes((prevState) => {
      return {
        ...prevState,
        creditScoresComponents: types[0].riskTypeValues.map(mapRiskTypes),
        timeinBusinessComponents: types[1].riskTypeValues.filter(filterRiskTypes).map(mapRiskTypes),
        annualRevenueComponents: types[2].riskTypeValues.filter(filterRiskTypes).map(mapRiskTypes),
        debtToIncomeRatioComponents: types[3].riskTypeValues
          .filter(filterRiskTypes)
          .map(mapRiskTypes),
        collateralComponents: types[4].riskTypeValues.filter(filterCollateral).map(mapRiskTypes),
        allRiskTypes: types,
      };
    });
  };

  const onErrorGetTypes = (error) => {
    _logger(error, "Error Getting RiskType");
    toastr.error("Unable to get Risk Types");
  };

  const mapStatusTypes = (statusType) => {
    return (
      <option key={statusType.id} value={statusType.id}>
        {statusType.name}
      </option>
    );
  };

  const mapRiskTypes = (riskType) => {
    return (
      <option key={riskType.id} value={riskType.id}>
        {`${riskType.description}`}
      </option>
    );
  };

  const filterCollateral = (riskType, index) => {
    const value = riskType.points;

    if (value >= 1 && value <= 3 && index === 0) {
      return true;
    } else if (value >= 4 && value <= 6 && index === 3) {
      return true;
    } else if (value >= 7 && value <= 10 && index === 6) {
      return true;
    } else {
      return false;
    }
  };

  const filterRiskTypes = (riskType, index) => {
    const value = riskType.points;

    if (value >= 1 && value <= 5 && index === 0) {
      return true;
    } else if (value >= 6 && value <= 10 && index === 5) {
      return true;
    } else if (value >= 11 && value <= 15 && index === 10) {
      return true;
    } else if (value >= 16 && value <= 20 && index === 15) {
      return true;
    } else {
      return false;
    }
  };

  function renderTimeInBusinessOptions(value) {
    let options = [];
    let names = [];

    if (value >= 37 && value <= 41) {
      options = [37, 38, 39, 40, 41];
      names = [1, 2, 3, 4, 5];
    } else if (value >= 42 && value <= 46) {
      options = [42, 43, 44, 45, 46];
      names = [6, 7, 8, 9, 10];
    } else if (value >= 47 && value <= 51) {
      options = [47, 48, 49, 50, 51];
      names = [11, 12, 13, 14, 15];
    } else if (value >= 52) {
      options = [52, 53, 54, 55, 56];
      names = [16, 17, 18, 19, 20];
    }

    return (
      <div className="col-3 form-floating">
        <Field
          as="select"
          name="timeInBusiness.entityId"
          className="form-control"
          placeholder="Select an Option"
        >
          <option value="">Select a Point</option>
          {options.map((option, index) => (
            <option key={option} value={option}>
              {names[index]}
            </option>
          ))}
        </Field>
        <ErrorMessage name="timeInBusiness.entityId" component="div" className="formik-has-error" />
        <label htmlFor="timeInBusiness.entityId">Point</label>
      </div>
    );
  }

  function renderAnnualRevenueOptions(value) {
    let options = [];
    let names = [];

    if (value >= 57 && value <= 61) {
      options = [57, 58, 50, 60, 61];
      names = [1, 2, 3, 4, 5];
    } else if (value >= 62 && value <= 66) {
      options = [62, 63, 64, 65, 66];
      names = [6, 7, 8, 9, 10];
    } else if (value >= 67 && value <= 71) {
      options = [67, 68, 69, 70, 71];
      names = [11, 12, 13, 14, 15];
    } else if (value >= 72) {
      options = [72, 73, 74, 75, 76];
      names = [16, 17, 18, 19, 20];
    }

    return (
      <div className="col-3 form-floating">
        <Field
          as="select"
          name="annualRevenue.entityId"
          className="form-control"
          placeholder="Select an Option"
        >
          <option value="">Select a Point</option>
          {options.map((option, index) => (
            <option key={option} value={option}>
              {names[index]}
            </option>
          ))}
        </Field>
        <ErrorMessage name="annualRevenue.entityId" component="div" className="formik-has-error" />
        <label htmlFor="annualRevenue.entityId">Point</label>
      </div>
    );
  }
  function renderDebtToIncomeRatioOptions(value) {
    let options = [];
    let names = [];

    if (value >= 77 && value <= 81) {
      options = [77, 78, 79, 80, 81];
      names = [1, 2, 3, 4, 5];
    } else if (value >= 82 && value <= 86) {
      options = [82, 83, 84, 85, 86];
      names = [6, 7, 8, 9, 10];
    } else if (value >= 87 && value <= 91) {
      options = [87, 88, 89, 90, 91];
      names = [11, 12, 13, 14, 15];
    }

    return (
      <div className="col-3 form-floating">
        <Field
          as="select"
          name="debtToIncomeRatio.entityId"
          className="form-control"
          placeholder="Select an Option"
        >
          <option value="">Select a Point</option>
          {options.map((option, index) => (
            <option key={option} value={option}>
              {names[index]}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name="debtToIncomeRatio.entityId"
          component="div"
          className="formik-has-error"
        />
        <label htmlFor="debtToIncomeRatio.entityId">Point</label>
      </div>
    );
  }

  function renderCollateralOptions(value) {
    let options = [];
    let names = [];

    if (value >= 92 && value <= 94) {
      options = [92, 93, 94];
      names = [1, 2, 3];
    } else if (value >= 95 && value <= 97) {
      options = [95, 96, 97];
      names = [4, 5, 6];
    } else if (value >= 98 && value <= 101) {
      options = [98, 99, 100, 101];
      names = [7, 8, 9, 10];
    }

    return (
      <div className="col-3 form-floating">
        <Field
          as="select"
          name="collateral.entityId"
          className="form-control"
          placeholder="Select an Option"
        >
          <option value="">Select a Point</option>
          {options.map((option, index) => (
            <option key={option} value={option}>
              {names[index]}
            </option>
          ))}
        </Field>
        <ErrorMessage name="collateral.entityId" component="div" className="formik-has-error" />
        <label htmlFor="collateral.entityId">Point</label>
      </div>
    );
  }

  const handleSubmit = (values, actions) => {
    let {
      amount,
      creditScore,
      timeInBusiness,
      annualRevenue,
      debtToIncomeRatio,
      collateral,
      timeInBusinessDefault,
      annualRevenueDefault,
      debtToIncomeRatioDefault,
      collateralDefault,
      userId,
      statusTypeId,
      id,
    } = values;

    if (!amount) {
      amount = null;
    }

    const riskTypes = [];
    if (!roles.includes("Admin", "Merchant")) {
      riskTypes.push(creditScore);
      riskTypes.push(timeInBusinessDefault);
      riskTypes.push(annualRevenueDefault);
      riskTypes.push(debtToIncomeRatioDefault);
      riskTypes.push(collateralDefault);
    } else {
      riskTypes.push(creditScore);
      riskTypes.push(timeInBusiness);
      riskTypes.push(annualRevenue);
      riskTypes.push(debtToIncomeRatio);
      riskTypes.push(collateral);
    }
    if (!riskFormData.id) {
      riskProfileService
        .create({
          riskTypes,
          amount,
          statusTypeId,
          userId,
        })
        .then(onCreateSuccess)
        .catch(onCreateError)
        .finally(() => {
          actions.setSubmitting(false);
        });
    } else {
      riskProfileService
        .update(id, { amount, statusTypeId, riskTypes })
        .then(onUpdateSuccess)
        .catch(onUpdateError)
        .finally(() => {
          actions.setSubmitting(false);
        });
    }
  };

  const onCreateSuccess = (response) => {
    _logger("Submit Success", response);
    toastr.success("Successfully Created Risk Profile");
    roles.includes("Admin") || roles.includes("Merchant")
      ? navigate("/riskprofiles")
      : navigate("/riskprofiles/loanoffers");
  };

  const onCreateError = (error) => {
    _logger("Submit Error", error);
    toastr.error("Creation Error");
  };

  const onUpdateSuccess = (response) => {
    _logger("Submit Success", response);
    toastr.success("Successfully Updated the Risk Profile");
    navigate(`/riskprofiles`);
    setRiskFormData((prevState) => ({
      ...prevState,
      isEditing: false,
    }));
  };

  const onUpdateError = (error) => {
    _logger("Submit Error", error);
    toastr.error("Cannot Update", error.response.data.errors);
  };

  useEffect(() => {
    if (state?.type === "RISK_TYPE" && state?.risk) {
      _logger("form data populating", state.risk);

      setRiskFormData((prevState) => {
        const newRisk = { ...prevState };
        const riskData = { ...state.risk };
        newRisk.isEditing = true;
        newRisk.amount = riskData.amount;
        newRisk.id = riskData.id;
        newRisk.userId = riskData.user.id;
        newRisk.statusTypeId = riskData.statusType.id;

        newRisk.creditScore.entityId = riskData.scoreCard.creditScore.id;

        newRisk.timeInBusinessDefault.entityId = getDefaultValueInRange(
          riskData.scoreCard.timeInBusiness.id,
          [37, 42, 47, 52]
        );
        newRisk.annualRevenueDefault.entityId = getDefaultValueInRange(
          riskData.scoreCard.annualRevenue.id,
          [57, 62, 67, 72]
        );
        newRisk.debtToIncomeRatioDefault.entityId = getDefaultValueInRange(
          riskData.scoreCard.debtToIncomeRatio.id,
          [77, 82, 87]
        );
        newRisk.collateralDefault.entityId = getDefaultValueInRange(
          riskData.scoreCard.collateral.id,
          [92, 95, 98]
        );

        newRisk.timeInBusiness.entityId = riskData.scoreCard.timeInBusiness.id;

        newRisk.annualRevenue.entityId = riskData.scoreCard.annualRevenue.id;

        newRisk.debtToIncomeRatio.entityId = riskData.scoreCard.debtToIncomeRatio.id;

        newRisk.collateral.entityId = riskData.scoreCard.collateral.id;
        newRisk.user = riskData.user;
        return newRisk;
      });
    }
  }, [state]);

  const getDefaultValueInRange = (code, rangeValues) => {
    let closestValue = rangeValues[0];

    for (let i = 0; i < rangeValues.length; i++) {
      if (code >= rangeValues[i]) {
        closestValue = rangeValues[i];
      } else {
        break;
      }
    }

    return closestValue;
  };

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">
                {riskFormData.isEditing ? "Edit Risk Profile" : "Create Risk Profile"}
              </h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="d-md-flex">
        <Formik
          enableReinitialize={true}
          initialValues={riskFormData}
          onSubmit={handleSubmit}
          validationSchema={
            !roles.includes("Admin", "Merchant")
              ? riskProfileDefaultFormSchema
              : riskProfileFormSchema
          }
        >
          {({ values }) => (
            <Row className="row">
              <Col lg={values.creditScore.entityId ? 6 : 12} md={6} sm={12}>
                <div className="justify-content-center align-items-center">
                  <div
                    className="form-group container mt-4 card risk-gradient-border shadow-lg rounded pb-2 mb-2 p-4 bg-white"
                    style={{ maxWidth: "500px" }}
                  >
                    <Form className="formik-form">
                      <div className="row form-group m-2">
                        <div className="col-6 form-floating">
                          <Field
                            type="number"
                            name="amount"
                            className="form-control"
                            placeholder="amount"
                          />
                          <ErrorMessage
                            name="amount"
                            component="div"
                            className="formik-has-error"
                          />
                          <label htmlFor="amount">Amount</label>
                        </div>

                        <div className="col-6 form-floating">
                          <Field
                            as="select"
                            name="creditScore.entityId"
                            className="form-control"
                            placeholder="Select an Option"
                          >
                            <option value="">Select an option</option>
                            {riskTypes.creditScoresComponents}
                          </Field>
                          <ErrorMessage
                            name="creditScore.entityId"
                            component="div"
                            className="formik-has-error"
                          />
                          <label htmlFor="creditScore.entityId">CreditScore</label>
                        </div>
                      </div>
                      <div className="row form-group m-2">
                        <div
                          className={
                            values.timeInBusinessDefault.entityId &&
                            roles.includes("Admin", "Merchant")
                              ? "col-9 col-sm-9 form-floating"
                              : "form-floating"
                          }
                        >
                          <Field
                            as="select"
                            name="timeInBusinessDefault.entityId"
                            className="form-control"
                            placeholder="Select an Option"
                          >
                            <option value="">Select an Option</option>
                            {riskTypes.timeinBusinessComponents}
                          </Field>
                          <ErrorMessage
                            name="timeInBusinessDefault.entityId"
                            component="div"
                            className="formik-has-error"
                          />
                          <label htmlFor="timeInBusinessDefault.entityId">Time In Business</label>
                        </div>
                        {values.timeInBusinessDefault.entityId > 0 &&
                          (roles.includes("Admin") || roles.includes("Merchant")) &&
                          renderTimeInBusinessOptions(values.timeInBusinessDefault.entityId)}
                      </div>

                      <div className="row form-group m-2">
                        <div
                          className={
                            values.annualRevenueDefault.entityId &&
                            (roles.includes("Admin") || roles.includes("Merchant"))
                              ? "col-9 form-floating"
                              : "form-floating"
                          }
                        >
                          <Field
                            as="select"
                            name="annualRevenueDefault.entityId"
                            className="form-control"
                            placeholder="Select an Option"
                          >
                            <option value="">Select an Option</option>
                            {riskTypes.annualRevenueComponents}
                          </Field>
                          <ErrorMessage
                            name="annualRevenueDefault.entityId"
                            component="div"
                            className="formik-has-error"
                          />
                          <label htmlFor="annualRevenueDefault.entityId">Annual Revenue</label>
                        </div>
                        {values.annualRevenueDefault.entityId > 0 &&
                          (roles.includes("Admin") || roles.includes("Merchant")) &&
                          renderAnnualRevenueOptions(values.annualRevenueDefault.entityId)}
                      </div>
                      <div className="row form-group m-2">
                        <div
                          className={
                            values.debtToIncomeRatioDefault.entityId &&
                            (roles.includes("Admin") || roles.includes("Merchant"))
                              ? "col-9 form-floating"
                              : "form-floating"
                          }
                        >
                          <Field
                            as="select"
                            name="debtToIncomeRatioDefault.entityId"
                            className="form-control"
                            placeholder="Select an Option"
                          >
                            <option value="">Select an Option</option>
                            {riskTypes.debtToIncomeRatioComponents}
                          </Field>
                          <ErrorMessage
                            name="debtToIncomeRatioDefault.entityId"
                            component="div"
                            className="formik-has-error"
                          />
                          <label htmlFor="debtToIncomeRatioDefault.entityId">
                            Debt To Income Ratio
                          </label>
                        </div>
                        {values.debtToIncomeRatioDefault.entityId > 0 &&
                          (roles.includes("Admin") || roles.includes("Merchant")) &&
                          renderDebtToIncomeRatioOptions(values.debtToIncomeRatioDefault.entityId)}
                      </div>
                      <div className="row form-group m-2">
                        <div
                          className={
                            values.collateralDefault.entityId &&
                            (roles.includes("Admin") || roles.includes("Merchant"))
                              ? "col-9 form-floating"
                              : "form-floating"
                          }
                        >
                          <Field
                            as="select"
                            name="collateralDefault.entityId"
                            className="form-control"
                            placeholder="Select an Option"
                          >
                            <option value="">Select an Option</option>
                            {riskTypes.collateralComponents}
                          </Field>
                          <ErrorMessage
                            name="collateralDefault.entityId"
                            component="div"
                            className="formik-has-error"
                          />
                          <label htmlFor="collateralDefault.entityId">Collateral</label>
                        </div>
                        {values.collateralDefault.entityId > 0 &&
                          roles.includes("Admin", "Merchant") &&
                          renderCollateralOptions(values.collateralDefault.entityId)}
                      </div>

                      <div className="row form-group m-2">
                        {riskFormData.id && (
                          <div className="col-9 form-floating">
                            <Field
                              as="select"
                              name="statusTypeId"
                              className="form-control"
                              placeholder="Select an Option"
                            >
                              <option value="">Select Status</option>
                              {riskTypes.statusTypesComponents}
                            </Field>
                            <ErrorMessage
                              name="statusTypeId"
                              component="div"
                              className="formik-has-error"
                            />
                            <label htmlFor="statusTypeId">Status</label>
                          </div>
                        )}
                      </div>

                      <div className="text-end">
                        <Button className="me-2" variant="primary" type="submit">
                          Submit
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </Col>

              {values.creditScore.entityId && (
                <RiskProfilePreview
                  isEditing={riskFormData.isEditing}
                  user={riskFormData.user}
                  preview={values}
                  currentUser={props.currentUser}
                  riskTypes={riskTypes.allRiskTypes}
                />
              )}
            </Row>
          )}
        </Formik>
      </Row>
    </>
  );
}

RiskProfileForm.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default React.memo(RiskProfileForm);
