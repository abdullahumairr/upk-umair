import { useEffect, useState } from "react";
import { RiAddLine, RiEditLine, RiDeleteBinLine } from "react-icons/ri";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";
import type { Category } from "../../types";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditData(null);
    setForm({ name: "", slug: "", description: "" });
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditData(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (editData) {
      await updateCategory(editData.id, form);
    } else {
      await createCategory(form);
    }
    setIsModalOpen(false);
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kategori ini?")) return;
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Kategori</h1>
        <Button onClick={openCreate}>
          <RiAddLine size={18} /> Tambah Kategori
        </Button>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="pb-3 font-medium">Nama</th>
              <th className="pb-3 font-medium">Slug</th>
              <th className="pb-3 font-medium">Deskripsi</th>
              <th className="pb-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="py-3 font-medium text-gray-800">{cat.name}</td>
                <td className="py-3 text-gray-500">{cat.slug}</td>
                <td className="py-3 text-gray-500">{cat.description || "-"}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEdit(cat)}
                    >
                      <RiEditLine size={15} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <RiDeleteBinLine size={15} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  Belum ada kategori
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editData ? "Edit Kategori" : "Tambah Kategori"}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Nama Kategori"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="contoh: Matematika"
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="contoh: matematika"
          />
          <Input
            label="Deskripsi"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Deskripsi singkat (opsional)"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;
