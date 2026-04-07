import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RiAddLine, RiDeleteBinLine, RiEyeLine,
  RiPlayLine, RiCheckLine, RiEditLine
} from 'react-icons/ri';
import { getExams, deleteExam, publishExam, getQuestions } from '../../services/api';
import type { Exam, Question } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import ExamForm from './ExamForm';

const ExamList = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Exam | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const [eRes, qRes] = await Promise.all([getExams(), getQuestions()]);
    setExams(eRes.data.data);
    setQuestions(qRes.data.data);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus ujian ini?')) return;
    await deleteExam(id);
    fetchData();
  };

  const handlePublish = async (id: number) => {
    if (!confirm('Publish ujian ini?')) return;
    await publishExam(id);
    fetchData();
  };

  const openCreate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEdit = (exam: Exam) => {
    setEditData(exam);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Ujian</h1>
        <Button onClick={openCreate}>
          <RiAddLine size={18} /> Buat Ujian
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {exams.map((exam) => (
          <Card key={exam.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="font-medium text-gray-800">{exam.title}</h2>
                  <Badge
                    label={exam.is_published ? 'Published' : 'Draft'}
                    variant={exam.is_published ? 'published' : 'draft'}
                  />
                </div>
                <p className="text-sm text-gray-500">{exam.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {exam.time_limit_minutes} menit · Oleh: {exam.creator_name}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {exam.is_published && (
                  <Button size="sm" onClick={() => navigate(`/exams/${exam.id}/do`)}>
                    <RiPlayLine size={15} /> Mulai
                  </Button>
                )}

                {/* Lihat soal */}
                <Button variant="secondary" size="sm" onClick={() => navigate(`/exams/${exam.id}`)}>
                  <RiEyeLine size={15} />
                </Button>

                {/* Edit — hanya jika masih draft */}
                {!exam.is_published && (
                  <Button variant="secondary" size="sm" onClick={() => openEdit(exam)}>
                    <RiEditLine size={15} />
                  </Button>
                )}

                {/* Publish */}
                {!exam.is_published && (
                  <Button variant="success" size="sm" onClick={() => handlePublish(exam.id)}>
                    <RiCheckLine size={15} />
                  </Button>
                )}

                <Button variant="danger" size="sm" onClick={() => handleDelete(exam.id)}>
                  <RiDeleteBinLine size={15} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {exams.length === 0 && (
          <Card>
            <p className="text-center text-gray-400 py-8">Belum ada ujian</p>
          </Card>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editData ? 'Edit Ujian' : 'Buat Ujian'}
      >
        <ExamForm
          questions={questions}
          editData={editData}
          onSuccess={() => { setIsModalOpen(false); fetchData(); }}
        />
      </Modal>
    </div>
  );
};

export default ExamList;