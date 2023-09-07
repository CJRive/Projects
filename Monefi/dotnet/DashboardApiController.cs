using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Monefi.Services.Interfaces;
using Sabio.Services;
using Monefi.Web.Controllers;
using Monefi.Web.Models.Responses;
using System;
using Monefi.Models.Domain.DashBoards;
using Monefi.Models;
using System.Collections;

namespace Monefi.Web.Api.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardApiController : BaseApiController
    {
        private IDashboardService _dashboardService = null;
        private IAuthenticationService<int> _authService = null;
        
        public DashboardApiController(IDashboardService service,
            ILogger<DashboardApiController> logger,
            IAuthenticationService<int> authentication) : base(logger)
        {
            _dashboardService = service;
            _authService = authentication;

        }

        [HttpGet("borrowers")]
        public ActionResult<ItemResponse<BorrowerDashboard>> GetBorrowersDash(int pageIndex, int pageSize, bool isCompleted)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();


                BorrowerDashboard dashboard = _dashboardService.GetBorrowerDashUI(pageIndex, pageSize, userId, isCompleted);

                if (dashboard == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Data Not Available");
                }
                else
                {
                    iCode = 200;
                    response = new ItemResponse<BorrowerDashboard> { Item = dashboard };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);

        }

    }
}
