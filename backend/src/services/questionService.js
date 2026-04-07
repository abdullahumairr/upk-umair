import pool from "../config/db.js";
import AppError from "../errors/AppError.js";

export const getAllQuestions = async () => {
  const [rows] = await pool.query(`
    SELECT q.*, c.name AS category_name
    FROM questions q
    JOIN categories c ON q.category_id = c.id
    ORDER BY q.created_at DESC
  `);
  return rows;
};

export const getQuestionById = async (id) => {
  const [rows] = await pool.query(
    `SELECT q.*, c.name AS category_name
     FROM questions q
     JOIN categories c ON q.category_id = c.id
     WHERE q.id = ?`,
    [id],
  );
  if (rows.length === 0) throw new AppError("Soal tidak ditemukan", 404);

  const [options] = await pool.query(
    "SELECT * FROM options WHERE question_id = ? ORDER BY option_label",
    [id],
  );

  return { ...rows[0], options };
};

export const createQuestion = async ({
  category_id,
  question_text,
  difficulty,
  author_name,
  options,
  image_url,
}) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "INSERT INTO questions (category_id, question_text, difficulty, author_name, image_url) VALUES (?, ?, ?, ?, ?)",
      [category_id, question_text, difficulty, author_name, image_url || null],
    );
    const question_id = result.insertId;

    const parsedOptions =
      typeof options === "string" ? JSON.parse(options) : options;
    for (const opt of parsedOptions) {
      await conn.query(
        "INSERT INTO options (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)",
        [question_id, opt.option_label, opt.option_text, opt.is_correct],
      );
    }

    await conn.commit();
    return {
      id: question_id,
      category_id,
      question_text,
      difficulty,
      author_name,
      image_url,
      options: parsedOptions,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const updateQuestion = async (
  id,
  { category_id, question_text, difficulty, author_name, options, image_url },
) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query("SELECT id FROM questions WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) throw new AppError("Soal tidak ditemukan", 404);

    let parsedOptions;
    try {
      parsedOptions =
        typeof options === "string" ? JSON.parse(options) : options;
    } catch (e) {
      throw new AppError("Format pilihan jawaban tidak valid", 400);
    }

    if (!parsedOptions || parsedOptions.length === 0) {
      throw new AppError("Pilihan jawaban tidak boleh kosong", 400);
    }

    const [existing] = await conn.query(
      "SELECT image_url FROM questions WHERE id = ?",
      [id],
    );
    const finalImageUrl =
      image_url !== undefined && image_url !== null
        ? image_url
        : existing[0].image_url;

    await conn.query(
      "UPDATE questions SET category_id = ?, question_text = ?, difficulty = ?, author_name = ?, image_url = ? WHERE id = ?",
      [category_id, question_text, difficulty, author_name, finalImageUrl, id],
    );

    // Hapus answers yang terkait dengan options soal ini dulu
    const [oldOptions] = await conn.query(
      "SELECT id FROM options WHERE question_id = ?",
      [id],
    );
    if (oldOptions.length > 0) {
      const oldOptionIds = oldOptions.map((o) => o.id);
      await conn.query(
        `UPDATE answers SET selected_option_id = NULL WHERE selected_option_id IN (${oldOptionIds.map(() => "?").join(",")})`,
        oldOptionIds,
      );
    }

    await conn.query("DELETE FROM options WHERE question_id = ?", [id]);

    for (const opt of parsedOptions) {
      await conn.query(
        "INSERT INTO options (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)",
        [id, opt.option_label, opt.option_text, opt.is_correct ? 1 : 0],
      );
    }

    await conn.commit();
    return {
      id,
      category_id,
      question_text,
      difficulty,
      author_name,
      image_url: finalImageUrl,
      options: parsedOptions,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const deleteQuestion = async (id) => {
  const [rows] = await pool.query("SELECT id FROM questions WHERE id = ?", [
    id,
  ]);
  if (rows.length === 0) throw new AppError("Soal tidak ditemukan", 404);
  await pool.query("DELETE FROM questions WHERE id = ?", [id]);
};
