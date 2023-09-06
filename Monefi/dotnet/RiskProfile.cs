using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.RiskProfiles
{
    public class RiskProfile
    {
        public int Id { get; set; } 
        public BaseUser User { get; set; }
        public int TotalRiskValue { get; set; }
        public ScoreCard ScoreCard { get; set; } 
        public decimal Amount { get; set; }
        public LookUp StatusType { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        
    }
}
