import { useState, useEffect } from "react";
import {
  createQuestion,
  updateQuestion,
  getQuestionById,
} from "../../services/api";
import type { Category, Question } from "../../types";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

interface Props {
  categories: Category[];
  editData: Question | null;
  onSuccess: () => void;
}

const emptyOptions = [
  { option_label: "A", option_text: "", is_correct: false },
  { option_label: "B", option_text: "", is_correct: false },
  { option_label: "C", option_text: "", is_correct: false },
  { option_label: "D", option_text: "", is_correct: false },
];

const QuestionForm = ({ categories, editData, onSuccess }: Props) => {
  const [form, setForm] = useState({
    category_id: "",
    question_text: "",
    difficulty: "medium",
    author_name: "",
  });
  const [options, setOptions] = useState(emptyOptions);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch detail soal saat edit agar options lama termuat
  useEffect(() => {
    if (editData) {
      getQuestionById(editData.id).then((res) => {
        const q = res.data.data;
        setForm({
          category_id: q.category_id.toString(),
          question_text: q.question_text,
          difficulty: q.difficulty,
          author_name: q.author_name,
        });
        if (q.options && q.options.length > 0) {
          setOptions(
            q.options.map((o) => ({
              option_label: o.option_label,
              option_text: o.option_text,
              is_correct: o.is_correct,
            })),
          );
        }
      });
    } else {
      setForm({
        category_id: "",
        question_text: "",
        difficulty: "medium",
        author_name: "",
      });
      setOptions(emptyOptions);
      setImage(null);
    }
  }, [editData]);

  const setCorrect = (index: number) => {
    setOptions(options.map((o, i) => ({ ...o, is_correct: i === index })));
  };

  const handleSubmit = async () => {
    if (!form.category_id || !form.question_text || !form.author_name) {
      alert("Kategori, pertanyaan, dan nama pembuat wajib diisi");
      return;
    }
    const hasCorrect = options.some((o) => o.is_correct);
    if (!hasCorrect) {
      alert("Pilih salah satu jawaban yang benar");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("category_id", form.category_id);
      fd.append("question_text", form.question_text);
      fd.append("difficulty", form.difficulty);
      fd.append("author_name", form.author_name);
      fd.append("options", JSON.stringify(options));
      if (image) fd.append("image", image);

      if (editData) {
        await updateQuestion(editData.id, fd);
      } else {
        await createQuestion(fd);
      }
      onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Gagal menyimpan soal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Kategori</label>
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
        >
          <option value="">Pilih kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Pertanyaan</label>
        <textarea
          value={form.question_text}
          onChange={(e) => setForm({ ...form, question_text: e.target.value })}
          rows={3}
          placeholder="Tulis pertanyaan di sini..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Tingkat Kesulitan
          </label>
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <Input
          label="Nama Pembuat"
          value={form.author_name}
          onChange={(e) => setForm({ ...form, author_name: e.target.value })}
          placeholder="Nama kamu"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Gambar Soal (opsional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
        />
        {editData?.image_url && !image && (
          <img
            src={`http://localhost:3000${editData.image_url}`}
            alt="gambar soal"
            className="mt-2 h-24 object-contain rounded-lg border border-gray-200"
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Pilihan Jawaban
        </label>
        <p className="text-xs text-gray-400">
          Klik lingkaran untuk menandai jawaban benar
        </p>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCorrect(i)}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
                ${
                  opt.is_correct
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 hover:border-gray-400"
                }`}
            >
              <span className="text-xs font-bold">{opt.option_label}</span>
            </button>
            <input
              value={opt.option_text}
              onChange={(e) => {
                const updated = [...options];
                updated[i] = { ...updated[i], option_text: e.target.value };
                setOptions(updated);
              }}
              placeholder={`Pilihan ${opt.option_label}`}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Soal"}
        </Button>
      </div>
    </div>
  );
};

export default QuestionForm;
