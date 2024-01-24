using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.RiskProfiles
{
    public class RiskTypeValue
    {
        public int Id { get; set; }
        public int RiskTypeId { get; set; }
        public string Description { get; set; }
        public int Points { get; set; }
    }
}
