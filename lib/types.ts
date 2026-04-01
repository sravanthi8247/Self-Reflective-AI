export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type ExplanationAgentOutput = {
  explanation: string;
  examples: string[];
};

export type CriticAgentOutput = {
  clarity: string;
  completeness: string;
  examples: string;
};

export type ImproverAgentOutput = {
  improvedExplanation: string;
};

/** One round of explain → critic → improve in the iterative controller. */
export type IterationRecord = {
  iteration: number;
  explanation: ExplanationAgentOutput;
  feedback: CriticAgentOutput;
  improved: string;
};

export type ReasonResponse = {
  topic: string;
  usedMock: boolean;
  iterations: IterationRecord[];
  difficulty: DifficultyLevel;
};

export type QuizQuestion = {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
};

export type QuizResponse = {
  questions: QuizQuestion[];
  usedMock: boolean;
  difficulty: DifficultyLevel;
};
