using Newtonsoft.Json;
using Monefi.Data;
using Monefi.Data.Providers;
using Monefi.Models;
using Monefi.Models.Domain;
using Monefi.Models.Domain.DashBoards;
using Monefi.Models.Domain.LoanApplications;
using Monefi.Services.Interfaces;
using System.Collections.Generic;
using Monefi.Models.Domain.Goals;
using Monefi.Models.Domain.RiskProfiles;
using System;
using Microsoft.Extensions.Logging;

namespace Monefi.Services
{
    public class DashboardService : IDashboardService
    {
        readonly IDataProvider _data = null;
        ILoanApplicationService _loanApplication = null;
        IGoalService _goalService = null;
        IBorrowerVerificationService _borrowerVerificationService = null;
        IRiskProfileService _riskProfileService = null;
        ILogger<DashboardService> _logger = null; 

        public DashboardService(
            IDataProvider data,
            ILoanApplicationService loanApplication, 
            IGoalService goalService,
            IBorrowerVerificationService borrowerVerificationService,
            IRiskProfileService riskProfileService,
            ILogger<DashboardService> logger
        )
        {
            _data = data;
            _loanApplication = loanApplication;
            _goalService = goalService;
            _borrowerVerificationService = borrowerVerificationService;
            _riskProfileService = riskProfileService;
            _logger = logger;
        }
        public BorrowerDashboard GetBorrowerDashUI(int pageIndex, int pageSize, int userId, bool isCompleted)
        {
            BorrowerDashboard dashboard = new BorrowerDashboard();

            try
            {
                RiskProfile riskProfile = _riskProfileService.Get(userId);

                dashboard.RiskProfile = riskProfile;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occured while getting the borrower dashboard for the user", userId);
            }

            try
            {
                Paged<LoanApplication> application = _loanApplication.GetPaginatedCurrent(pageIndex, pageSize, userId);
                dashboard.LoanApplications = application;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occured while getting the borrower dashboard for the user", userId);
            }

            try
            {
                Paged<Goal> goals = _goalService.Get(pageIndex, pageSize, userId, isCompleted);
                dashboard.Goals = goals;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occured while getting the borrower dashboard for the user", userId);

            }

            try
            {
                List<BorrowerVerification> borrowerVerifications = _borrowerVerificationService.GetByUser(userId);
                dashboard.BorrowerVerifications = borrowerVerifications;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occured while getting the borrower dashboard for the user", userId);
            }

            return dashboard;
        }
    }
}
