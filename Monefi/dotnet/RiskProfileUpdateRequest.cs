using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Monefi.Models.Requests.RiskProfiles
{
    public class RiskProfileUpdateRequest: RiskProfileAddRequest, IModelIdentifier
    {
        public int Id { get; set; }     
    }
}
