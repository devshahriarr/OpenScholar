"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

export default function EditPaperDraftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    categoryId: ""
  });

  useEffect(() => {
    async function fetchPaper() {
      try {
        const res = await fetch(`/api/papers/${id}`);
        if (!res.ok) throw new Error("Failed to load paper");
        const data = await res.json();
        
        setFormData({
          title: data.title,
          abstract: data.abstract,
          keywords: data.tags?.join(", ") || "",
          categoryId: data.categoryId || "" // Would need category to be passed or fetched
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPaper();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        title: formData.title,
        abstract: formData.abstract,
        keywords: formData.keywords.split(",").map(k => k.trim()).filter(Boolean)
        // Note: categoryId omitted for brevity in UI, but supported by backend
      };

      const res = await fetch(`/api/papers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save draft");
      }

      router.push("/my-uploads");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Paper Draft</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 rounded-2xl shadow-premium border border-border">
        <div>
          <label className="block text-sm font-semibold mb-2">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Abstract</label>
          <textarea
            required
            rows={6}
            value={formData.abstract}
            onChange={e => setFormData({ ...formData, abstract: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Keywords (comma separated)</label>
          <input
            type="text"
            value={formData.keywords}
            onChange={e => setFormData({ ...formData, keywords: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg font-bold text-text-secondary hover:bg-background transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
