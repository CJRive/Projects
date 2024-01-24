using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Monefi.Models.Domain.RiskProfiles
{
    public class RiskType
    {
        public int Id { get; set; }

        public List<RiskTypeValue> RiskTypeValues { get; set; } 
    }
}
