import * as questionService from "../services/questionService.js";

export const getAll = async (req, res, next) => {
  try {
    const data = await questionService.getAllQuestions();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await questionService.getQuestionById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const data = await questionService.createQuestion({
      ...req.body,
      image_url,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const image_url = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image_url || null;
    const data = await questionService.updateQuestion(req.params.id, {
      ...req.body,
      image_url,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await questionService.deleteQuestion(req.params.id);
    res.json({ success: true, message: "Soal berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};
