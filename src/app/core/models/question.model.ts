export interface Question {
  id: string;
  categoryId: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
}
