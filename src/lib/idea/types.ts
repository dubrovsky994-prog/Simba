export type StepAnswer = { optionId: string | null; customText: string }

export type IdeaAnswers = {
  projectType: StepAnswer
  targetAudience: StepAnswer
  ideaDescription: string
  projectStage: StepAnswer
}

export const EMPTY_IDEA_ANSWERS: IdeaAnswers = {
  projectType: { optionId: null, customText: '' },
  targetAudience: { optionId: null, customText: '' },
  ideaDescription: '',
  projectStage: { optionId: null, customText: '' },
}
