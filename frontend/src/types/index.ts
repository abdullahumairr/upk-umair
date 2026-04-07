export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface Option {
  id: number;
  question_id: number;
  option_label: string;
  option_text: string;
  is_correct: boolean;
}

export interface Question {
  id: number;
  category_id: number;
  category_name: string;
  question_text: string;
  difficulty: "easy" | "medium" | "hard";
  author_name: string;
  image_url: string | null;
  created_at: string;
  options: Option[];
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  creator_name: string;
  time_limit_minutes: number;
  is_published: boolean;
  created_at: string;
  questions?: Question[];
}

export interface Answer {
  question_id: number;
  selected_option_id: number;
}

export interface Submission {
  id: number;
  exam_id: number;
  exam_title: string;
  participant_name: string;
  score: number;
  total_questions: number;
  submitted_at: string;
  answers?: SubmissionAnswer[];
}

export interface SubmissionAnswer {
  id: number;
  question_id: number;
  question_text: string;
  selected_answer: string;
  correct_answer: string;
  correct_label: string;
  is_correct: boolean;
}
