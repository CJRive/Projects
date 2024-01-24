USE [MoneFi]
GO
/****** Object:  Table [dbo].[RiskProfile]    Script Date: 7/26/2023 2:05:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RiskProfile](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[TotalRiskValue] [int] NOT NULL,
	[Amount] [decimal](15, 2) NULL,
	[StatusTypeId] [int] NOT NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateModified] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_RiskProfile] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[RiskProfile] ADD  CONSTRAINT [DF_RiskProfile_StatusTypeId]  DEFAULT ((1)) FOR [StatusTypeId]
GO
ALTER TABLE [dbo].[RiskProfile] ADD  CONSTRAINT [DF_RiskProfile_DateCreated]  DEFAULT (getutcdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[RiskProfile] ADD  CONSTRAINT [DF_RiskProfile_DateModified]  DEFAULT (getutcdate()) FOR [DateModified]
GO
ALTER TABLE [dbo].[RiskProfile]  WITH CHECK ADD  CONSTRAINT [FK_RiskProfile_RiskStatusType] FOREIGN KEY([StatusTypeId])
REFERENCES [dbo].[RiskStatusTypes] ([Id])
GO
ALTER TABLE [dbo].[RiskProfile] CHECK CONSTRAINT [FK_RiskProfile_RiskStatusType]
GO
ALTER TABLE [dbo].[RiskProfile]  WITH CHECK ADD  CONSTRAINT [FK_RiskProfile_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[RiskProfile] CHECK CONSTRAINT [FK_RiskProfile_Users]
GO
