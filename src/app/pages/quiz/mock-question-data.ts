import { QuizQuestion } from '../../core/models/quiz-question.model';

export const MOCK_QUIZ_QUESTIONS: Record<QuizQuestion['ageGroup'], QuizQuestion[]> = {
  '7-9': [
    {
      id: 1,
      ageGroup: '7-9',
      subject: 'Genesis',
      question: 'Who built the ark?',
      difficulty: 'Easy',
      answerType: 'text',
      answer: 'Noah'
    },
    {
      id: 2,
      ageGroup: '7-9',
      subject: 'Creation',
      question: 'What did God create on the first day?',
      difficulty: 'Medium',
      answerType: 'text',
      answer: 'Light'
    },
    {
      id: 3,
      ageGroup: '7-9',
      subject: 'Jonah',
      question: 'Who swallowed Jonah?',
      difficulty: 'Hard',
      answerType: 'text',
      answer: 'A great fish'
    }
  ],
  '10-12': [
    {
      id: 4,
      ageGroup: '10-12',
      subject: 'The Gospels',
      question: 'How many disciples did Jesus have?',
      difficulty: 'Easy',
      answerType: 'text',
      answer: '12'
    },
    {
      id: 5,
      ageGroup: '10-12',
      subject: 'Exodus',
      question: 'Which sea did Moses part?',
      difficulty: 'Medium',
      answerType: 'text',
      answer: 'Red Sea'
    },
    {
      id: 6,
      ageGroup: '10-12',
      subject: 'David and Goliath',
      question: 'Who killed Goliath?',
      difficulty: 'Hard',
      answerType: 'text',
      answer: 'David'
    }
  ],
  '13-15': [
    {
      id: 7,
      ageGroup: '13-15',
      subject: 'Romans',
      question: 'Who wrote the book of Romans?',
      difficulty: 'Easy',
      answerType: 'text',
      answer: 'Paul'
    },
    {
      id: 8,
      ageGroup: '13-15',
      subject: 'Math Practice',
      question: 'Solve: 12 × 8 = ?',
      difficulty: 'Medium',
      answerType: 'math',
      answer: '96'
    },
    {
      id: 9,
      ageGroup: '13-15',
      subject: 'New Testament',
      question: 'What is the first book of the New Testament?',
      difficulty: 'Hard',
      answerType: 'text',
      answer: 'Matthew'
    }
  ],
  '16-18': [
    {
      id: 10,
      ageGroup: '16-18',
      subject: 'Grace',
      question: 'Explain the meaning of grace.',
      difficulty: 'Easy',
      answerType: 'text',
      answer: 'God\'s unearned favor and love'
    },
    {
      id: 11,
      ageGroup: '16-18',
      subject: 'Algebra',
      question: 'Solve: 2x + 6 = 18',
      difficulty: 'Medium',
      answerType: 'math',
      answer: '6'
    },
    {
      id: 12,
      ageGroup: '16-18',
      subject: 'Kings of Israel',
      question: 'Who was the first king of Israel?',
      difficulty: 'Hard',
      answerType: 'text',
      answer: 'Saul'
    }
  ]
};