import pool from "../config/db.js";
import AppError from "../errors/AppError.js";

export const getAllExams = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM exams ORDER BY created_at DESC",
  );
  return rows;
};

export const getExamById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM exams WHERE id = ?", [id]);
  if (rows.length === 0) throw new AppError("Ujian tidak ditemukan", 404);

  const [questions] = await pool.query(
    `
    SELECT q.*, c.name AS category_name, eq.question_order
    FROM exam_questions eq
    JOIN questions q ON eq.question_id = q.id
    JOIN categories c ON q.category_id = c.id
    WHERE eq.exam_id = ?
    ORDER BY eq.question_order
  `,
    [id],
  );

  for (const q of questions) {
    const [options] = await pool.query(
      "SELECT * FROM options WHERE question_id = ? ORDER BY option_label",
      [q.id],
    );
    q.options = options;
  }

  return { ...rows[0], questions };
};

export const createExam = async ({
  title,
  description,
  creator_name,
  time_limit_minutes,
  question_ids,
}) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "INSERT INTO exams (title, description, creator_name, time_limit_minutes) VALUES (?, ?, ?, ?)",
      [title, description, creator_name, time_limit_minutes],
    );
    const exam_id = result.insertId;

    for (let i = 0; i < question_ids.length; i++) {
      await conn.query(
        "INSERT INTO exam_questions (exam_id, question_id, question_order) VALUES (?, ?, ?)",
        [exam_id, question_ids[i], i + 1],
      );
    }

    await conn.commit();
    return {
      id: exam_id,
      title,
      description,
      creator_name,
      time_limit_minutes,
      question_ids,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const publishExam = async (id) => {
  const [rows] = await pool.query("SELECT id FROM exams WHERE id = ?", [id]);
  if (rows.length === 0) throw new AppError("Ujian tidak ditemukan", 404);
  await pool.query("UPDATE exams SET is_published = TRUE WHERE id = ?", [id]);
};

export const updateExam = async (
  id,
  { title, description, creator_name, time_limit_minutes, question_ids },
) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query("SELECT id FROM exams WHERE id = ?", [id]);
    if (rows.length === 0) throw new AppError("Ujian tidak ditemukan", 404);

    await conn.query(
      "UPDATE exams SET title = ?, description = ?, creator_name = ?, time_limit_minutes = ? WHERE id = ?",
      [title, description, creator_name, time_limit_minutes, id],
    );

    await conn.query("DELETE FROM exam_questions WHERE exam_id = ?", [id]);
    for (let i = 0; i < question_ids.length; i++) {
      await conn.query(
        "INSERT INTO exam_questions (exam_id, question_id, question_order) VALUES (?, ?, ?)",
        [id, question_ids[i], i + 1],
      );
    }

    await conn.commit();
    return {
      id,
      title,
      description,
      creator_name,
      time_limit_minutes,
      question_ids,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const deleteExam = async (id) => {
  const [rows] = await pool.query("SELECT id FROM exams WHERE id = ?", [id]);
  if (rows.length === 0) throw new AppError("Ujian tidak ditemukan", 404);
  await pool.query("DELETE FROM exams WHERE id = ?", [id]);
};
