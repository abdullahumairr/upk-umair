import { useEffect, useState } from "react";
import { RiFolder3Line, RiQuestionLine, RiFileList3Line } from "react-icons/ri";
import { getCategories, getQuestions, getExams } from "../services/api";
import Card from "../components/ui/Card";

const Home = () => {
  const [counts, setCounts] = useState({
    categories: 0,
    questions: 0,
    exams: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [cat, que, exam] = await Promise.all([
        getCategories(),
        getQuestions(),
        getExams(),
      ]);
      setCounts({
        categories: cat.data.data.length,
        questions: que.data.data.length,
        exams: exam.data.data.length,
      });
    };
    fetchCounts();
  }, []);

  const stats = [
    {
      label: "Total Kategori",
      value: counts.categories,
      icon: <RiFolder3Line size={24} />,
      color: "text-purple-500 bg-purple-50",
    },
    {
      label: "Total Soal",
      value: counts.questions,
      icon: <RiQuestionLine size={24} />,
      color: "text-blue-500 bg-blue-50",
    },
    {
      label: "Total Ujian",
      value: counts.exams,
      icon: <RiFileList3Line size={24} />,
      color: "text-green-500 bg-green-50",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
