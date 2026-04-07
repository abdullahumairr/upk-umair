import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Home from "./pages/Home";
import CategoryList from "./pages/categories/CategoryList";
import QuestionList from "./pages/questions/QuestionList";
import ExamList from "./pages/exams/ExamList";
import ExamDetail from "./pages/exams/ExamDetail";
import DoExam from "./pages/submissions/DoExam";
import Result from "./pages/submissions/Result";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="flex pt-16 min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-56 flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/questions" element={<QuestionList />} />
            <Route path="/exams" element={<ExamList />} />
            <Route path="/exams/:id" element={<ExamDetail />} />
            <Route path="/exams/:id/do" element={<DoExam />} />
            <Route path="/submissions/:id/result" element={<Result />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
