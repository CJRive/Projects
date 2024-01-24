using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Monefi.Models;
using Monefi.Models.Domain;
using Monefi.Models.Domain.RiskProfiles;
using Monefi.Models.Requests;
using Monefi.Models.Requests.RiskProfiles;
using Monefi.Services;
using Monefi.Services.Interfaces;
using Monefi.Web.Controllers;
using Monefi.Web.Models.Responses;
using SendGrid;
using System;
using System.Collections.Generic;

namespace Monefi.Web.Api.Controllers
{
    [Route("api/riskprofiles")]
    [ApiController]
    public class RiskProfileApiController : BaseApiController
    {
        private IRiskProfileService _service = null;
        IAuthenticationService<int> _authService = null;

        public RiskProfileApiController(IRiskProfileService service
            , ILogger<RiskProfileApiController> logger
            , IAuthenticationService<int> authenticationService) : base(logger)
        {
            _service = service;
            _authService = authenticationService;
        }

        [HttpGet("types")]
        public ActionResult<ItemResponse<List<RiskType>>> GetTypes()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<RiskType> allRiskTypeValues = _service.GetAllRiskTypes();

                if (allRiskTypeValues.Count == 0)
                {
                    code = 404;
                    response = new ErrorResponse("No RiskTypeValues found.");
                }
                else
                {
                    response = new ItemResponse<List<RiskType>> { Item = allRiskTypeValues };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }
    

    [HttpGet("{userId:int}")]
        public ActionResult<ItemResponse<RiskProfile>> GetByUserId(int userId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                RiskProfile profile = _service.Get(userId);
                if (profile == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<RiskProfile> { Item = profile };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpGet()]
        public ActionResult<ItemResponse<Paged<RiskProfile>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<RiskProfile> paged = _service.Get(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse(" Application Record Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<RiskProfile>> { Item = paged };

                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());

            }
            return StatusCode(code, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<RiskProfile>>> PaginationRiskValue(int pageIndex, int pageSize, string riskValue)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<RiskProfile> paged = _service.Get(pageIndex, pageSize, riskValue);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse(" No records found for that filter");
                }
                else
                {
                    response = new ItemResponse<Paged<RiskProfile>> { Item = paged };

                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());

            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<int> Create(RiskProfileAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>();
                response.Item = id;
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }


        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(RiskProfileUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {

                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> DeleteById(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
       


       



    }

}
