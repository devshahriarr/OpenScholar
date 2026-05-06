"use client";

import { useState } from "react";
import { Upload, File, X, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { StepIndicator } from "@/modules/paper/components/upload-stepper";

export default function PaperUploadPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    category: "",
    keywords: "",
    coAuthors: "",
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-10 text-left">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Submit New Paper</h1>
        <p className="text-text-secondary mt-2">Share your research with the world</p>
      </div>

      <StepIndicator currentStep={step} />

      <div className="card-premium p-8 md:p-12 min-h-[500px]">
        {step === 1 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-text-primary">Upload Your Paper</h2>
            <div 
              className="border-2 border-dashed border-border rounded-2xl p-16 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer bg-background/50 group"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <input 
                id="fileInput"
                type="file" 
                className="hidden" 
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-text-primary">Click to upload or drag and drop</p>
                <p className="text-sm text-text-muted mt-1">PDF, Image, Video (Max 50MB)</p>
              </div>
              {file && (
                <div className="mt-4 flex items-center gap-3 bg-surface px-4 py-2 rounded-lg border border-primary/20 shadow-sm">
                  <File size={18} className="text-primary" />
                  <span className="text-sm font-medium text-text-primary">{file.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-text-muted hover:text-error transition-colors">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-text-primary">Paper Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Paper Title *</label>
                <input 
                  type="text"
                  placeholder="Enter the title of your research paper"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Abstract *</label>
                <textarea 
                  rows={6}
                  placeholder="Provide a brief summary of your research"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                  value={formData.abstract}
                  onChange={(e) => setFormData({...formData, abstract: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Category *</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="cs">Computer Science</option>
                    <option value="env">Environmental Science</option>
                    <option value="physics">Physics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Keywords</label>
                  <input 
                    type="text"
                    placeholder="machine learning, AI, neural networks (comma-separated)"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    value={formData.keywords}
                    onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Co-Authors</label>
                <input 
                  type="text"
                  placeholder="Enter co-author names"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={formData.coAuthors}
                  onChange={(e) => setFormData({...formData, coAuthors: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-text-primary">Preview Submission</h2>
            <div className="border border-border rounded-2xl overflow-hidden">
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-4">{formData.title || "Untitled Paper"}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-text-secondary">
                      <span className="font-bold w-20">Authors:</span> 
                      <span>John Doe {formData.coAuthors && `, ${formData.coAuthors}`}</span>
                    </p>
                    <p className="flex items-center gap-2 text-text-secondary">
                      <span className="font-bold w-20">Category:</span> 
                      <span>{formData.category || "Not specified"}</span>
                    </p>
                    <p className="flex items-center gap-2 text-text-secondary">
                      <span className="font-bold w-20">Keywords:</span> 
                      <span className="italic">{formData.keywords || "None"}</span>
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t border-border">
                  <h4 className="text-sm font-bold text-text-primary mb-2 uppercase tracking-wider">Abstract</h4>
                  <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                    {formData.abstract || "No abstract provided."}
                  </p>
                </div>
              </div>
              <div className="bg-primary-light/30 px-8 py-4 border-t border-border">
                <p className="text-xs font-medium text-primary flex items-center gap-2">
                  <Info size={14} className="inline" />
                  Please review all details carefully before submitting. Your paper will undergo peer review before being published.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle2 size={56} />
            </div>
            <h2 className="text-3xl font-extrabold text-text-primary mb-4">Paper Submitted Successfully!</h2>
            <p className="text-text-secondary max-w-md mx-auto mb-10">
              Your paper has been submitted for review. You'll receive an email notification once the review process begins.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/my-uploads" className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
                Back to dashboard
              </Link>
              <button 
                onClick={() => { setStep(1); setFile(null); setFormData({title: "", abstract: "", category: "", keywords: "", coAuthors: ""}); }}
                className="bg-surface text-text-secondary border border-border px-10 py-4 rounded-xl font-bold hover:bg-background transition-all active:scale-95"
              >
                Submit Another
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {step < 4 && (
          <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
            <button 
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold border border-border text-text-secondary hover:bg-background transition-all disabled:opacity-0"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <button 
              onClick={nextStep}
              disabled={step === 1 && !file}
              className="flex items-center gap-2 px-10 py-3 rounded-xl font-bold bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {step === 3 ? "Submit" : "Next"}
              {step < 3 && <ChevronRight size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
