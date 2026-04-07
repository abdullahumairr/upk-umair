import pool from "../config/db.js";
import AppError from "../errors/AppError.js";

export const submitExam = async ({ exam_id, participant_name, answers }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [exam] = await conn.query(
      "SELECT id FROM exams WHERE id = ? AND is_published = TRUE",
      [exam_id],
    );
    if (exam.length === 0)
      throw new AppError("Ujian tidak ditemukan atau belum dipublish", 404);

    const total_questions = answers.length;

    const [result] = await conn.query(
      "INSERT INTO submissions (exam_id, participant_name, score, total_questions) VALUES (?, ?, 0, ?)",
      [exam_id, participant_name, total_questions],
    );
    const submission_id = result.insertId;

    let score = 0;

    for (const ans of answers) {
      const [optRows] = await conn.query(
        "SELECT is_correct FROM options WHERE id = ? AND question_id = ?",
        [ans.selected_option_id, ans.question_id],
      );
      const is_correct = optRows.length > 0 && optRows[0].is_correct ? 1 : 0;
      if (is_correct) score++;

      await conn.query(
        "INSERT INTO answers (submission_id, question_id, selected_option_id, is_correct) VALUES (?, ?, ?, ?)",
        [submission_id, ans.question_id, ans.selected_option_id, is_correct],
      );
    }

    await conn.query("UPDATE submissions SET score = ? WHERE id = ?", [
      score,
      submission_id,
    ]);

    await conn.commit();
    return {
      id: submission_id,
      submission_id,
      participant_name,
      score,
      total_questions,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getSubmissionById = async (id) => {
  const [rows] = await pool.query(
    `SELECT s.*, e.title AS exam_title
     FROM submissions s
     JOIN exams e ON s.exam_id = e.id
     WHERE s.id = ?`,
    [id],
  );
  if (rows.length === 0) throw new AppError("Submission tidak ditemukan", 404);

  const [answers] = await pool.query(
    `SELECT 
       a.id,
       a.question_id,
       a.selected_option_id,
       a.is_correct,
       q.question_text,
       o.option_text AS selected_answer,
       correct_opt.option_text AS correct_answer,
       correct_opt.option_label AS correct_label
     FROM answers a
     JOIN questions q ON a.question_id = q.id
     LEFT JOIN options o ON a.selected_option_id = o.id
     LEFT JOIN options correct_opt ON correct_opt.question_id = q.id AND correct_opt.is_correct = TRUE
     WHERE a.submission_id = ?`,
    [id],
  );

  return { ...rows[0], answers };
};

export const getSubmissionsByExam = async (exam_id) => {
  const [rows] = await pool.query(
    "SELECT * FROM submissions WHERE exam_id = ? ORDER BY submitted_at DESC",
    [exam_id],
  );
  return rows;
};
