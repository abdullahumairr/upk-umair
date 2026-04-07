import * as categoryService from '../services/categoryService.js';

export const getAll = async (req, res, next) => {
  try {
    const data = await categoryService.getAllCategories();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await categoryService.getCategoryById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const data = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const data = await categoryService.updateCategory(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (err) { next(err); }
};