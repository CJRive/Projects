USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[RiskProfile_InsertV2]    Script Date: 7/26/2023 2:05:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: Carlos Rivera
-- Create date: 07/23/2023
-- Description: Risk Profile insert calculation of TotalValue from bridge Refactored for new lookup. Executes Settings insert prior to Risk Profile insert
-- Code Reviewer:

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


CREATE PROC [dbo].[RiskProfile_InsertV2]
			@UserId int	
			,@Amount decimal(15,2) = NULL
			,@StatusTypeId int
			,@BatchRiskSettings dbo.RiskProfileSettingsUdt READONLY
			,@Id int OUTPUT
			



AS

/* Test Code

DECLARE @Id int  = 0

	DECLARE @UserId int	= 1
			,@Amount decimal(15,2) = 50000
			,@StatusTypeId int = 1
			,@BatchRiskSettings dbo.RiskProfileSettingsUdt 

	INSERT INTO @BatchRiskSettings (EntityId)
	VALUES
	(11), 
	(38),
	(75),
	(88), 
	(99)  	
	
	EXECUTE dbo.RiskProfile_InsertV2 
			@UserId
			,@Amount	
			,@StatusTypeId
			,@BatchRiskSettings
			,@Id OUTPUT
			

	SELECT *
	FROM dbo.RiskProfile
	WHERE Id = @Id

	SELECT rv.RiskTypeId, rv.Points
	FROM dbo.RiskProfileSettings AS rps
		INNER JOIN dbo.RiskTypeValues AS rv
			 ON rps.EntityId = rv.Id
			 AND rps.RiskTypeId = rv.RiskTypeId
	WHERE rps.UserId = @UserId

*/


BEGIN

	EXECUTE RiskProfileSettings_InsertV2 @UserId
										,@BatchRiskSettings

	DECLARE @TotalRiskValue int

	SELECT @TotalRiskValue = ISNULL(SUM([Points]), 0)
	FROM dbo.RiskProfileSettings AS rps
		INNER JOIN dbo.RiskTypeValues AS rv
			ON rps.EntityId = rv.Id
				AND rps.RiskTypeId = rv.RiskTypeId
	WHERE rps.UserId = @UserId
	GROUP BY UserId
	
	
	IF NOT EXISTS (SELECT 1 FROM dbo.RiskProfile WHERE UserId = @UserId)
	BEGIN

	INSERT INTO [dbo].[RiskProfile]
			   ([UserId]
			   ,[TotalRiskValue]
			   ,[Amount]
			   ,[StatusTypeId]
			   ,[DateCreated]
			   ,[DateModified])
		 VALUES
			   (@UserId 	
				,@TotalRiskValue 
				,@Amount 
				,@StatusTypeId 
				,GETUTCDATE()
				,GETUTCDATE()
			   )

	SET @Id = SCOPE_IDENTITY()

	

	END
END

GO
