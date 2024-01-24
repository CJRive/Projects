using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Monefi.Models.Requests.RiskProfiles
{
    public class RiskTypeAddAndUpdateRequest
    {
        [Required]
        [Range(1,101)]
        public int EntityId { get; set; }
    }
}
