using Monefi.Models;
using Monefi.Models.Domain;
using Monefi.Models.Domain.DashBoards;
using System.Collections.Generic;

namespace Monefi.Services
{
    public interface IDashboardService
    {
        BorrowerDashboard GetBorrowerDashUI(int pageIndex, int pageSize, int userId, bool isCompleted);
    }
}
