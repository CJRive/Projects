import { lazy } from "react";

const BorrowersDashboard = lazy(() =>
  import("../components/dashboard/borrowers/BorrowersDashboard")
);
const RiskProfileForm = lazy(() =>
  import("../components/riskprofiles/RiskProfileForm")
);
const RiskProfilePage = lazy(() =>
  import("../components/riskprofiles/RiskProfilePage")
);

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboards",
    icon: "uil-home-alt",
    header: "Navigation",
    children: [
      {
        path: "/dashboard/borrower",
        name: "BorrowerDashboard",
        element: BorrowersDashboard,
        roles: ["Admin", "Merchant", "Borrower"],
        exact: true,
        isAnonymous: false,
      }
    ],
  },
];

const riskRoutes = [
  {
    path: "/riskprofiles/new",
    name: "Risk Form",
    exact: true,
    element: RiskProfileForm,
    roles: ["Admin", "User", "Borrower", "Merchant"],
    isAnonymous: false,
  },
  {
    path: "/riskprofiles/:id",
    name: "Risk Form Update",
    exact: true,
    element: RiskProfileForm,
    roles: ["Admin", "Merchant"],
    isAnonymous: false,
  },
  {
    path: "/riskprofiles",
    name: "Risk Page",
    exact: true,
    element: RiskProfilePage,
    roles: ["Admin", "Merchant"],
    isAnonymous: false,
  },
  {
    path: "/riskprofiles/loanoffers",
    name: "Loan Offers",
    exact: true,
    element: LoansOffers,
    roles: ["Admin", "User", "Borrower", "Merchant"],
    isAnonymous: false,
  },
];

const allRoutes = [
  ...dashboardRoutes,
  ...riskRoutes,
];

export default allRoutes;
