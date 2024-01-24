USE [MoneFi]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RiskProfileSettings](
	[UserId] [int] NOT NULL,
	[RiskTypeId] [int] NOT NULL,
	[EntityId] [int] NOT NULL,
 CONSTRAINT [PK_RiskProfileSettings] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RiskTypeId] ASC,
	[EntityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[RiskProfileSettings]  WITH CHECK ADD  CONSTRAINT [FK_RiskProfileSettings_RiskTypes] FOREIGN KEY([RiskTypeId])
REFERENCES [dbo].[RiskTypes] ([Id])
GO
ALTER TABLE [dbo].[RiskProfileSettings] CHECK CONSTRAINT [FK_RiskProfileSettings_RiskTypes]
GO
ALTER TABLE [dbo].[RiskProfileSettings]  WITH CHECK ADD  CONSTRAINT [FK_RiskProfileSettings_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[RiskProfileSettings] CHECK CONSTRAINT [FK_RiskProfileSettings_Users]
GO
