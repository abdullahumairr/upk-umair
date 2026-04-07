import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RiArrowLeftLine, RiPlayLine, RiTimeLine } from "react-icons/ri";
import { getExamById } from "../../services/api";
import type { Exam } from "../../types";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);

  useEffect(() => {
    getExamById(Number(id)).then((res) => setExam(res.data.data));
  }, [id]);

  if (!exam) return <p className="text-gray-400 text-sm">Memuat...</p>;

  return (
    <div>
      <button
        onClick={() => navigate("/exams")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 cursor-pointer"
      >
        <RiArrowLeftLine size={16} /> Kembali
      </button>

      <Card className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-semibold text-gray-800">
                {exam.title}
              </h1>
              <Badge
                label={exam.is_published ? "Published" : "Draft"}
                variant={exam.is_published ? "published" : "draft"}
              />
            </div>
            <p className="text-sm text-gray-500 mb-2">{exam.description}</p>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <RiTimeLine size={15} />
              {exam.time_limit_minutes} menit · {exam.questions?.length || 0}{" "}
              soal · Oleh: {exam.creator_name}
            </div>
          </div>
          {exam.is_published && (
            <Button onClick={() => navigate(`/exams/${id}/do`)}>
              <RiPlayLine size={16} /> Mulai Ujian
            </Button>
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        {exam.questions?.map((q, i) => (
          <Card key={q.id}>
            <div className="flex gap-3">
              <span className="text-gray-400 text-sm font-medium">
                {i + 1}.
              </span>
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <Badge label={q.category_name} />
                  <Badge
                    label={q.difficulty}
                    variant={q.difficulty as "easy" | "medium" | "hard"}
                  />
                </div>
                <p className="text-sm text-gray-800 mb-3">{q.question_text}</p>
                {q.image_url && (
                  <img
                    src={`http://localhost:3000${q.image_url}`}
                    alt="soal"
                    className="rounded-lg max-h-48 object-contain mb-3"
                  />
                )}
                {/* Tampilkan pilihan TANPA menandai mana yang benar */}
                <div className="grid grid-cols-2 gap-2">
                  {q.options?.map((opt) => (
                    <div
                      key={opt.id}
                      className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-600"
                    >
                      <span className="font-medium">{opt.option_label}.</span>{" "}
                      {opt.option_text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExamDetail;
