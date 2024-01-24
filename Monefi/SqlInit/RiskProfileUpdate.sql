USE [MoneFi]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: Carlos Rivera
-- Create date: 
-- Description: Risk Profile Update. Executes setting update prior to Risk Profile update
-- Code Reviewer:

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


CREATE PROC [dbo].[RiskProfile_Update]
			@Id int	
			,@Amount decimal(15,2) = NULL
			,@StatusTypeId int
			,@BatchRiskSettings dbo.RiskProfileSettingsUdt READONLY
			
			 
			


AS

/* Test Code

	DECLARE @Id int	= 7
			,@Amount decimal = 40000
			,@StatusTypeId int = 1
			,@BatchRiskSettings dbo.RiskProfileSettingsUdt 
			
	INSERT INTO @BatchRiskSettings (EntityId)
	VALUES
	(36), 
	(56),
	(76),
	(91), 
	(101)  			

	EXECUTE dbo.RiskProfile_Update
			@Id
			,@Amount
			,@StatusTypeId
			,@BatchRiskSettings
			
			
			

	SELECT *
	FROM dbo.RiskProfile
	WHERE Id = @Id

*/


BEGIN

	DECLARE @UserId int 

    SELECT @UserId = UserId
    FROM dbo.RiskProfile
    WHERE Id = @Id	

	EXECUTE RiskProfileSettings_Update @UserId
										,@BatchRiskSettings

		DECLARE @TotalRiskValue int

	SELECT @TotalRiskValue = ISNULL(SUM([Points]), 0)
	FROM dbo.RiskProfileSettings AS rps
		INNER JOIN dbo.RiskTypeValues AS rv
			ON rps.EntityId = rv.Id
				AND rps.RiskTypeId = rv.RiskTypeId
	WHERE rps.UserId = @UserId
	GROUP BY UserId
	
	

	UPDATE dbo.RiskProfile
	SET [Amount] = @Amount,
		[TotalRiskValue] = @TotalRiskValue,
		[StatusTypeId] = @StatusTypeId,
		[DateModified] = GETUTCDATE()
	WHERE Id = @Id

END

GO
