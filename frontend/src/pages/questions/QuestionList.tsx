import { useEffect, useState } from 'react';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiImageLine } from 'react-icons/ri';
import { getQuestions, deleteQuestion, getCategories } from '../../services/api';
import type { Question, Category } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import QuestionForm from './QuestionForm';

const QuestionList = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Question | null>(null);

  const fetchData = async () => {
    const [qRes, cRes] = await Promise.all([getQuestions(), getCategories()]);
    setQuestions(qRes.data.data);
    setCategories(cRes.data.data);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus soal ini?')) return;
    await deleteQuestion(id);
    fetchData();
  };

  const openCreate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditData(q);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Bank Soal</h1>
        <Button onClick={openCreate}>
          <RiAddLine size={18} /> Tambah Soal
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {questions.map((q, i) => (
          <Card key={q.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 flex-1">
                <span className="text-gray-400 text-sm font-medium mt-0.5">{i + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge label={q.category_name} />
                    <Badge
                      label={q.difficulty}
                      variant={q.difficulty as 'easy' | 'medium' | 'hard'}
                    />
                    {q.image_url && <RiImageLine size={16} className="text-gray-400" />}
                  </div>
                  <p className="text-sm text-gray-800">{q.question_text}</p>
                  <p className="text-xs text-gray-400 mt-1">Oleh: {q.author_name}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="secondary" size="sm" onClick={() => openEdit(q)}>
                  <RiEditLine size={15} />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(q.id)}>
                  <RiDeleteBinLine size={15} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {questions.length === 0 && (
          <Card>
            <p className="text-center text-gray-400 py-8">Belum ada soal</p>
          </Card>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editData ? 'Edit Soal' : 'Tambah Soal'}
      >
        <QuestionForm
          categories={categories}
          editData={editData}
          onSuccess={() => { setIsModalOpen(false); fetchData(); }}
        />
      </Modal>
    </div>
  );
};

export default QuestionList;