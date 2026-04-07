import * as examService from "../services/examService.js";

export const getAll = async (req, res, next) => {
  try {
    const data = await examService.getAllExams();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await examService.getExamById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = await examService.createExam(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = await examService.updateExam(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const publish = async (req, res, next) => {
  try {
    await examService.publishExam(req.params.id);
    res.json({ success: true, message: "Ujian berhasil dipublish" });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await examService.deleteExam(req.params.id);
    res.json({ success: true, message: "Ujian berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};
