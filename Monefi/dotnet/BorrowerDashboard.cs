using Monefi.Models.Domain.Goals;
using Monefi.Models.Domain.LoanApplications;
using Monefi.Models.Domain.RiskProfiles;
using System.Collections.Generic;

namespace Monefi.Models.Domain.DashBoards
{
    public class BorrowerDashboard
    {
        public Paged<LoanApplication> LoanApplications { get; set; }

        public Paged<Goal> Goals { get; set; }

        public RiskProfile RiskProfile { get; set; }

        public List<BorrowerVerification> BorrowerVerifications { get; set; }

    }
}
