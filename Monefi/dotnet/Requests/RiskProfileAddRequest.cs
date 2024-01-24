using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Monefi.Models.Requests.RiskProfiles
{
    public class RiskProfileAddRequest
    {
        [Range(1.00, 100000.00)]
        public decimal? Amount { get; set; }
        [Required]
        [Range(1, 3)]
        public int StatusTypeId { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(5)]
        public List<RiskTypeAddAndUpdateRequest> RiskTypes { get; set; }
    }
}
