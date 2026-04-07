import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RiTimeLine } from "react-icons/ri";
import { getExamById, submitExam } from "../../services/api";
import type { Exam, Answer } from "../../types";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const DoExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getExamById(Number(id)).then((res) => {
      setExam(res.data.data);
      setTimeLeft((res.data.data.time_limit_minutes || 60) * 60);
    });
  }, [id]);

  useEffect(() => {
    if (!started) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          // eslint-disable-next-line react-hooks/immutability
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [started]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current!);
    const answerList: Answer[] = Object.entries(answers).map(([qid, oid]) => ({
      question_id: Number(qid),
      selected_option_id: oid,
    }));
    const res = await submitExam({
      exam_id: Number(id),
      participant_name: name,
      answers: answerList,
    });
    navigate(`/submissions/${res.data.data.id}/result`);
  };

  if (!exam) return <p className="text-gray-400 text-sm">Memuat...</p>;

  if (!started) {
    return (
      <div className="max-w-md mx-auto mt-16">
        <Card>
          <h1 className="text-lg font-semibold text-gray-800 mb-1">
            {exam.title}
          </h1>
          <p className="text-sm text-gray-500 mb-4">{exam.description}</p>
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-6">
            <RiTimeLine size={15} />
            {exam.time_limit_minutes} menit · {exam.questions?.length} soal
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama kamu"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4"
          />
          <Button
            className="w-full justify-center"
            onClick={() => setStarted(true)}
            disabled={!name.trim()}
          >
            Mulai Ujian
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-16 bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between z-30 -mx-6 mb-6">
        <p className="text-sm font-medium text-gray-700">{exam.title}</p>
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1 text-sm font-medium ${timeLeft < 60 ? "text-red-500" : "text-gray-600"}`}
          >
            <RiTimeLine size={15} /> {formatTime(timeLeft)}
          </span>
          <Button size="sm" onClick={handleSubmit}>
            Kumpulkan
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 max-w-2xl">
        {exam.questions?.map((q, i) => (
          <Card key={q.id}>
            <p className="text-sm font-medium text-gray-800 mb-3">
              {i + 1}. {q.question_text}
            </p>
            {q.image_url && (
              <img
                src={`http://localhost:3000${q.image_url}`}
                alt="soal"
                className="rounded-lg max-h-48 object-contain mb-3"
              />
            )}
            <div className="flex flex-col gap-2">
              {q.options?.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAnswers({ ...answers, [q.id]: opt.id })}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer
                    ${
                      answers[q.id] === opt.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                >
                  <span className="font-medium">{opt.option_label}.</span>{" "}
                  {opt.option_text}
                </button>
              ))}
            </div>
          </Card>
        ))}

        <Button
          className="w-full justify-center"
          size="lg"
          onClick={handleSubmit}
        >
          Kumpulkan Jawaban
        </Button>
      </div>
    </div>
  );
};

export default DoExam;
