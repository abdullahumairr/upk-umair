import pool from '../config/db.js';
import AppError from '../errors/AppError.js';

export const getAllCategories = async () => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
  return rows;
};

export const getCategoryById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  if (rows.length === 0) throw new AppError('Kategori tidak ditemukan', 404);
  return rows[0];
};

export const createCategory = async ({ name, slug, description }) => {
  const [result] = await pool.query(
    'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
    [name, slug, description]
  );
  return { id: result.insertId, name, slug, description };
};

export const updateCategory = async (id, { name, slug, description }) => {
  await getCategoryById(id);
  await pool.query(
    'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?',
    [name, slug, description, id]
  );
  return { id, name, slug, description };
};

export const deleteCategory = async (id) => {
  await getCategoryById(id);
  await pool.query('DELETE FROM categories WHERE id = ?', [id]);
};