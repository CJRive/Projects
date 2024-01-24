USE [MoneFi]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Carlos Rivera
-- Create date: 07/24/2023
-- Description: Risk Profile Select by Id 
-- Code Reviewer:

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC [dbo].[RiskProfile_Select_ByUserId]
				@UserId int 

AS

/*

	DECLARE @UserId int = 1

	EXECUTE dbo.RiskProfile_Select_ByUserId @UserId

	SELECT*
	FROM dbo.RiskProfile

*/

BEGIN

	SELECT rp.[Id]
		,u.[Id] AS UserId
		,u.[FirstName]
		,u.[LastName]
		,u.[Mi]
		,u.[AvatarUrl]
		,[TotalRiskValue]
		,cs.Id AS CreditScoreId
        ,cs.[CreditScore] AS CreditScore
        ,cs.Points AS CreditScoreValue
        ,tib.Id AS TimeInBusinessId
        ,tib.[TimeInBusiness] AS TimeInBusiness
        ,tib.Points AS TimeInBusinessValue
        ,ar.Id AS AnnualRevenueId
        ,ar.[AnnualRevenue] AS AnnualRevenue
        ,ar.Points AS AnnualRevenueValue
        ,ditr.Id AS DebtToIncomeRatioId
        ,ditr.[DebtToIncomeRatio] AS DebtToIncomeRatio
        ,ditr.Points AS DebtToIncomeRatioValue
        ,c.[Id] AS CollateralId
        ,c.[Collateral] 
		,c.Points as CollateralValue
		,[Amount]
		,rst.[Id] AS StatusId
		,rst.[Name] AS [Status]
		,rp.[DateCreated]
		,rp.[DateModified]
	FROM [dbo].[RiskProfile] AS rp
		INNER JOIN dbo.RiskStatusTypes as rst
			ON rp.StatusTypeId = rst.Id
		INNER JOIN dbo.Users AS u
			ON rp.UserId = u.Id
	LEFT OUTER JOIN (
        SELECT rsp.UserId,rtv.Id, rtv.[Description] AS CreditScore, rtv.Points
        FROM dbo.RiskProfileSettings AS rsp
			INNER JOIN dbo.RiskTypeValues AS rtv 
				ON rtv.Id = rsp.EntityId AND rsp.RiskTypeId = 1
					) AS cs	ON cs.UserId = rp.UserId
    LEFT OUTER JOIN (
        SELECT rsp.UserId,tib.Id, tib.[Description] AS TimeInBusiness, tib.Points 
        FROM dbo.RiskProfileSettings AS rsp
			INNER JOIN dbo.RiskTypeValues AS tib 
				ON tib.Id = rsp.EntityId AND rsp.RiskTypeId = 2
					) AS tib ON tib.UserId = rp.UserId
    LEFT OUTER JOIN (
        SELECT rsp.UserId, ar.Id, ar.[Description] AS AnnualRevenue, ar.Points
        FROM dbo.RiskProfileSettings AS rsp
			INNER JOIN dbo.RiskTypeValues AS ar 
				ON ar.Id = rsp.EntityId AND rsp.RiskTypeId = 3
					) AS ar ON ar.UserId = rp.UserId
    LEFT OUTER JOIN (
        SELECT rsp.UserId, ditr.Id, ditr.[Description] AS DebtToIncomeRatio, ditr.Points
        FROM dbo.RiskProfileSettings AS rsp
			INNER JOIN dbo.RiskTypeValues AS ditr 
				ON ditr.Id = rsp.EntityId AND rsp.RiskTypeId = 4
					) AS ditr ON ditr.UserId = rp.UserId
    LEFT OUTER JOIN (
        SELECT rsp.UserId,c.Id, c.[Description] AS Collateral, c.Points
        FROM dbo.RiskProfileSettings AS rsp
			INNER JOIN dbo.RiskTypeValues AS c 
				ON c.Id = rsp.EntityId AND rsp.RiskTypeId = 5
					) AS c ON c.UserId = rp.UserId
		
	
	WHERE rp.UserId = @UserId

END



GO
