import { useState, useEffect } from "react";
import { createExam, updateExam, getExamById } from "../../services/api";
import type { Question, Exam } from "../../types";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

interface Props {
  questions: Question[];
  editData?: Exam | null;
  onSuccess: () => void;
}

const ExamForm = ({ questions, editData, onSuccess }: Props) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    creator_name: "",
    time_limit_minutes: 60,
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title,
        description: editData.description,
        creator_name: editData.creator_name,
        time_limit_minutes: editData.time_limit_minutes,
      });
      // Fetch soal yang sudah dipilih
      getExamById(editData.id).then((res) => {
        const ids = res.data.data.questions?.map((q) => q.id) || [];
        setSelectedIds(ids);
      });
    } else {
      setForm({
        title: "",
        description: "",
        creator_name: "",
        time_limit_minutes: 60,
      });
      setSelectedIds([]);
    }
  }, [editData]);

  const toggleQuestion = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (!form.title || !form.creator_name) {
      alert("Judul dan nama pembuat wajib diisi");
      return;
    }
    if (selectedIds.length === 0) {
      alert("Pilih minimal 1 soal");
      return;
    }
    setLoading(true);
    try {
      if (editData) {
        await updateExam(editData.id, { ...form, question_ids: selectedIds });
      } else {
        await createExam({ ...form, question_ids: selectedIds });
      }
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Gagal menyimpan ujian");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Judul Ujian"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="contoh: UTS Matematika Kelas 10"
      />
      <Input
        label="Deskripsi"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Deskripsi ujian"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Nama Pembuat"
          value={form.creator_name}
          onChange={(e) => setForm({ ...form, creator_name: e.target.value })}
          placeholder="Nama kamu"
        />
        <Input
          label="Batas Waktu (menit)"
          type="number"
          value={form.time_limit_minutes}
          onChange={(e) =>
            setForm({ ...form, time_limit_minutes: Number(e.target.value) })
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Pilih Soal ({selectedIds.length} dipilih)
        </label>
        <div className="max-h-60 overflow-y-auto flex flex-col gap-2 pr-1">
          {questions.map((q) => (
            <div
              key={q.id}
              onClick={() => toggleQuestion(q.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors
                ${
                  selectedIds.includes(q.id)
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge label={q.category_name} />
                <Badge
                  label={q.difficulty}
                  variant={q.difficulty as "easy" | "medium" | "hard"}
                />
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {q.question_text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-2">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : editData ? "Update Ujian" : "Buat Ujian"}
        </Button>
      </div>
    </div>
  );
};

export default ExamForm;
