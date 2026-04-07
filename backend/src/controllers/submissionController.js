import * as submissionService from '../services/submissionService.js';

export const submit = async (req, res, next) => {
  try {
    const data = await submissionService.submitExam(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const getOne = async (req, res, next) => {
  try {
    const data = await submissionService.getSubmissionById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getByExam = async (req, res, next) => {
  try {
    const data = await submissionService.getSubmissionsByExam(req.params.exam_id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};