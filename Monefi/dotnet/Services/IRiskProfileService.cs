using Monefi.Models;
using Monefi.Models.Domain.RiskProfiles;
using Monefi.Models.Requests.RiskProfiles;
using System.Collections.Generic;

namespace Monefi.Services.Interfaces
{
    public interface IRiskProfileService
    {
        int Add(RiskProfileAddRequest model, int userId);
        void Delete(int id);
        Paged<RiskProfile> Get(int pageIndex, int pageSize, string riskValue);
        RiskProfile Get(int userId);
        Paged<RiskProfile> Get(int pageIndex, int pageSize);
        List<RiskType> GetAllRiskTypes();
        void Update(RiskProfileUpdateRequest model, int userId);

    }
}
