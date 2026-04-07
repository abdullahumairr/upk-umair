import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RiCheckLine, RiCloseLine, RiHome5Line } from "react-icons/ri";
import { getSubmissionById } from "../../services/api";
import type { Submission } from "../../types";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSubmissionById(Number(id))
      .then((res) => setSubmission(res.data.data))
      .catch(() => setError("Gagal memuat hasil ujian"));
  }, [id]);

  if (error)
    return (
      <div className="max-w-2xl mx-auto mt-16">
        <Card>
          <p className="text-center text-red-500 py-8">{error}</p>
          <div className="flex justify-center">
            <Button onClick={() => navigate("/")}>Kembali ke Beranda</Button>
          </div>
        </Card>
      </div>
    );

  if (!submission)
    return (
      <div className="max-w-2xl mx-auto mt-16">
        <Card>
          <p className="text-center text-gray-400 py-8">
            Memuat hasil ujian...
          </p>
        </Card>
      </div>
    );

  const percentage = Math.round(
    (submission.score / submission.total_questions) * 100,
  );
  const passed = percentage >= 70;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Skor */}
      <Card className="mb-6 text-center">
        <h1 className="text-lg font-semibold text-gray-800 mb-1">
          {submission.exam_title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Hasil ujian {submission.participant_name}
        </p>

        <div
          className={`text-6xl font-bold mb-2 ${passed ? "text-green-500" : "text-red-500"}`}
        >
          {percentage}
        </div>
        <p className="text-sm text-gray-400 mb-1">Nilai</p>
        <p
          className={`text-sm font-medium mb-6 ${passed ? "text-green-600" : "text-red-500"}`}
        >
          {passed
            ? "🎉 Selamat, kamu lulus!"
            : "😔 Kamu belum lulus, coba lagi!"}
        </p>

        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              {submission.score}
            </p>
            <p className="text-xs text-gray-400">Benar</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">
              {submission.total_questions - submission.score}
            </p>
            <p className="text-xs text-gray-400">Salah</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {submission.total_questions}
            </p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
        </div>

        <Button onClick={() => navigate("/")}>
          <RiHome5Line size={16} /> Kembali ke Beranda
        </Button>
      </Card>

      {/* Detail jawaban */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        Pembahasan Jawaban
      </h2>
      <div className="flex flex-col gap-3">
        {submission.answers?.map((ans, i) => (
          <Card key={ans.id}>
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 p-1.5 rounded-full shrink-0 ${ans.is_correct ? "bg-green-100" : "bg-red-100"}`}
              >
                {ans.is_correct ? (
                  <RiCheckLine size={14} className="text-green-600" />
                ) : (
                  <RiCloseLine size={14} className="text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  {i + 1}. {ans.question_text}
                </p>
                <div
                  className={`text-sm px-3 py-1.5 rounded-lg mb-1
                  ${
                    ans.is_correct
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  Jawaban kamu: {ans.selected_answer || "Tidak dijawab"}
                </div>
                {!ans.is_correct && (
                  <div className="text-sm px-3 py-1.5 rounded-lg bg-green-50 text-green-700">
                    Jawaban benar: {ans.correct_label}. {ans.correct_answer}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Result;
