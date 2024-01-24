using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.RiskProfiles;
using Sabio.Models.Requests.RiskProfiles;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class RiskProfileService : IRiskProfileService
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        IBaseUserMapper _baseUserMapper = null;

        public RiskProfileService(IDataProvider data, ILookUpService lookUpService, IBaseUserMapper baseUserMapper)
        {
            _data = data;
            _lookUpService = lookUpService;
            _baseUserMapper = baseUserMapper;
        }

        public List<RiskType> GetAllRiskTypes()
        {
            string procName = "[dbo].[RiskTypeValues_SelectAll]";
            Dictionary<int, List<RiskTypeValue>> riskTypeValuesByTypeId = null;
            List<RiskType> riskTypes = new List<RiskType>();
           

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {

            },
            delegate (IDataReader reader, short set)
            {
                int index = 0;
                
                    RiskTypeValue riskTypeValue = MapSingleRiskType(reader, ref index);
               
                    if (riskTypeValuesByTypeId == null)
                    {
                        riskTypeValuesByTypeId = new Dictionary<int, List<RiskTypeValue>>();
                    }

                    if (!riskTypeValuesByTypeId.ContainsKey(riskTypeValue.RiskTypeId))
                    {
                        riskTypeValuesByTypeId[riskTypeValue.RiskTypeId] = new List<RiskTypeValue>();
                    }

                    riskTypeValuesByTypeId[riskTypeValue.RiskTypeId].Add(riskTypeValue);

                


            });

            if (riskTypes != null)
            {
                foreach (var kvp in riskTypeValuesByTypeId)
                {
                    RiskType riskType = new RiskType();
                    riskType.Id = kvp.Key;
                    riskType.RiskTypeValues = kvp.Value;
                    riskTypes.Add(riskType);

                }
            }

            return riskTypes;
        }

        public RiskProfile Get(int userId)
        {
            string procName = "[dbo].[RiskProfile_Select_ByUserIdV4]";

            RiskProfile profile = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", userId);

            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                profile = MapSingleRiskProfile(reader, ref startingIndex);

            }
            );
            return profile;
        }

        public Paged<RiskProfile> Get(int pageIndex, int pageSize, string riskValue)
        {
            string procName = "[dbo].[RiskProfile_Select_ByRiskValueV4]";
            Paged<RiskProfile> pagedList = null;
            List<RiskProfile> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@RiskValue", riskValue);


            },
            delegate (IDataReader reader, short set)
            {
                int index = 0;

                RiskProfile profile = MapSingleRiskProfile(reader, ref index);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(index);
                }

                if (list == null)
                {
                    list = new List<RiskProfile>();
                }
                list.Add(profile);
            }
            );
            if (list != null)
            {
                pagedList = new Paged<RiskProfile>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }
        public Paged<RiskProfile> Get(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[RiskProfile_SelectAllV2]";
            Paged<RiskProfile> pagedList = null;
            List<RiskProfile> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);



            },
            delegate (IDataReader reader, short set)
            {
                int index = 0;

                RiskProfile profile = MapSingleRiskProfile(reader, ref index);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(index);
                }

                if (list == null)
                {
                    list = new List<RiskProfile>();
                }
                list.Add(profile);
            }
            );
            if (list != null)
            {
                pagedList = new Paged<RiskProfile>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        public int Add(RiskProfileAddRequest model, int userId)
        {

            int id = 0;
            string procName = "[dbo].[RiskProfile_InsertV2]";
            DataTable riskTypes = MapRiskTypesToTable(model.RiskTypes);
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    AddCommonParams(model, paramCollection);
                    paramCollection.AddWithValue("@UserId", userId);
                    paramCollection.AddWithValue("@BatchRiskSettings", riskTypes);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    paramCollection.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });
            return id;
        }

        public void Update(RiskProfileUpdateRequest model, int userId)
        {
            string procName = "[dbo].[RiskProfile_UpdateV2]";
            DataTable riskTypes = MapRiskTypesToTable(model.RiskTypes);
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    AddCommonParams(model, paramCollection);
                    paramCollection.AddWithValue("@Id", model.Id);
                    paramCollection.AddWithValue("@BatchRiskSettings", riskTypes);
                },
                returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[RiskProfile_Delete]";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            });

        }

        private DataTable MapRiskTypesToTable(List<RiskTypeAddAndUpdateRequest> risksToMap)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("EntityId", typeof(int));

            foreach (RiskTypeAddAndUpdateRequest singleRisk in risksToMap)
            {
                DataRow dr = dt.NewRow();
                int startingIndex = 0;
                dr.SetField(startingIndex++, singleRisk.EntityId);
                dt.Rows.Add(dr);
            }
            return dt;
        }


        private static void AddCommonParams(RiskProfileAddRequest model, SqlParameterCollection paramCollection)
        {
            paramCollection.AddWithValue("@Amount", model.Amount);
            paramCollection.AddWithValue("@StatusTypeId", model.StatusTypeId);
        }

        private RiskTypeValue MapSingleRiskType(IDataReader reader, ref int index)
        {
            RiskTypeValue riskTypeValue = new RiskTypeValue();
            riskTypeValue.Id = reader.GetSafeInt32(index++);
            riskTypeValue.RiskTypeId = reader.GetSafeInt32(index++);
            riskTypeValue.Description = reader.GetSafeString(index++);
            riskTypeValue.Points = reader.GetSafeInt32(index++);


            return riskTypeValue;
        }

        private RiskProfile MapSingleRiskProfile(IDataReader reader, ref int index)
        {
            RiskProfile aProfile = new RiskProfile();
            aProfile.ScoreCard = new ScoreCard();

            aProfile.Id = reader.GetSafeInt32(index++);
            aProfile.User = _baseUserMapper.MapBaseUser(reader, ref index);
            aProfile.TotalRiskValue = reader.GetSafeInt32(index++);
            aProfile.ScoreCard.CreditScore = MapSingleRiskLookup(reader, ref index);
            aProfile.ScoreCard.TimeInBusiness = MapSingleRiskLookup(reader, ref index);
            aProfile.ScoreCard.AnnualRevenue = MapSingleRiskLookup(reader, ref index);
            aProfile.ScoreCard.DebtToIncomeRatio = MapSingleRiskLookup(reader, ref index);
            aProfile.ScoreCard.Collateral = MapSingleRiskLookup(reader, ref index);
            aProfile.Amount = reader.GetSafeDecimal(index++);
            aProfile.StatusType = _lookUpService.MapSingleLookUp(reader, ref index);
            aProfile.DateCreated = reader.GetSafeDateTime(index++);
            aProfile.DateModified = reader.GetSafeDateTime(index++);

            return aProfile;
        }

        private RiskLookup MapSingleRiskLookup (IDataReader reader, ref int index)
        {
            RiskLookup lookUp = new RiskLookup ();

            lookUp.Id = reader.GetSafeInt32(index++);
            lookUp.Description = reader.GetSafeString(index++);
            lookUp.Points = reader.GetSafeInt32 (index++);

            return lookUp;
        }

    }
}




