import axios from "axios";
import type { Category, Question, Exam, Submission, Answer } from "../types";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const getCategories = () =>
  api.get<{ success: boolean; data: Category[] }>("/categories");

export const getCategoryById = (id: number) =>
  api.get<{ success: boolean; data: Category }>(`/categories/${id}`);

export const createCategory = (data: Omit<Category, "id" | "created_at">) =>
  api.post<{ success: boolean; data: Category }>("/categories", data);

export const updateCategory = (
  id: number,
  data: Omit<Category, "id" | "created_at">,
) => api.put<{ success: boolean; data: Category }>(`/categories/${id}`, data);

export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);

export const getQuestions = () =>
  api.get<{ success: boolean; data: Question[] }>("/questions");

export const getQuestionById = (id: number) =>
  api.get<{ success: boolean; data: Question }>(`/questions/${id}`);

export const createQuestion = (data: FormData) =>
  api.post<{ success: boolean; data: Question }>("/questions", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateQuestion = (id: number, data: FormData) =>
  api.put<{ success: boolean; data: Question }>(`/questions/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteQuestion = (id: number) => api.delete(`/questions/${id}`);

export const getExams = () =>
  api.get<{ success: boolean; data: Exam[] }>("/exams");

export const getExamById = (id: number) =>
  api.get<{ success: boolean; data: Exam }>(`/exams/${id}`);

export const createExam = (data: {
  title: string;
  description: string;
  creator_name: string;
  time_limit_minutes: number;
  question_ids: number[];
}) => api.post<{ success: boolean; data: Exam }>("/exams", data);

export const publishExam = (id: number) => api.patch(`/exams/${id}/publish`);

export const updateExam = (
  id: number,
  data: {
    title: string;
    description: string;
    creator_name: string;
    time_limit_minutes: number;
    question_ids: number[];
  },
) => api.put<{ success: boolean; data: Exam }>(`/exams/${id}`, data);

export const deleteExam = (id: number) => api.delete(`/exams/${id}`);

export const submitExam = (data: {
  exam_id: number;
  participant_name: string;
  answers: Answer[];
}) => api.post<{ success: boolean; data: Submission }>("/submissions", data);

export const getSubmissionById = (id: number) =>
  api.get<{ success: boolean; data: Submission }>(`/submissions/${id}`);

export const getSubmissionsByExam = (exam_id: number) =>
  api.get<{ success: boolean; data: Submission[] }>(
    `/submissions/exam/${exam_id}`,
  );
