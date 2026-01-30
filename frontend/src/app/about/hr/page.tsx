// app/(your-route)/HRPage.tsx
"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container";

// API-аас ирэх өгөгдөл
interface Policy {
  key: string;
  title: string;
  content: string;
  gradient: string;
  glowColor: string;
  iconBg: string;
  icon: React.ReactElement;
}

interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements?: string;
  deadline: string;
  status: string;
}

export default function HRPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [expandJobs, setExpandJobs] = useState(false);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const [policies, setPolicies] = useState<Record<string, Policy>>({});

  useEffect(() => {
    // Default jobs
    setJobs([
      {
        id: "1",
        title: "Зээлийн мэргэжилтэн",
        department: "Зээлийн хэлтэс",
        type: "Бүтэн цагийн",
        location: "Улаанбаатар",
        description:
          "Зээлийн хүсэлтийг хүлээн авч, шинжилгээ хийх, зээл олгох үйл ажиллагаанд оролцох.",
        requirements:
          "• Санхүү, эдийн засгийн чиглэлээр дээд боловсролтой\n• 2+ жилийн туршлагатай\n• Монгол, Англи хэлээр чөлөөтэй\n• MS Office-ийн advanced түвшин",
        deadline: "2025-12-31",
        status: "active",
      },
      {
        id: "2",
        title: "Кассчин",
        department: "Үйлчилгээний хэлтэс",
        type: "Бүтэн цагийн",
        location: "Дархан",
        description:
          "Мөнгөн гүйлгээний үйлчилгээ үзүүлэх, харилцагчдад зөвлөгөө өгөх.",
        requirements:
          "• Дунд боловсролтой\n• Үйлчилгээний туршлага давуу тал\n• Харилцааны чадвар сайн\n• Компьютер ашиглах чадвартай",
        deadline: "2025-12-15",
        status: "active",
      },
    ]);

    const defaultPolicies: Record<string, Policy> = {
      equal: {
        key: "equal",
        title: "Тэгш боломж",
        content:
          "Бүх ажилтанд ижил боломж, шударга хандлагыг баримтална. Хүйс, нас, үндэс угсаа, шашин шүтлэгээс үл хамааран бүх ажилтныг тэгш эрхтэйгээр хүлээн зөвшөөрдөг.",
        gradient: "from-blue-500 via-indigo-500 to-purple-500",
        glowColor: "rgba(99, 102, 241, 0.4)",
        iconBg: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        icon: (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
      training: {
        key: "training",
        title: "Сургалт",
        content:
          "Мэргэжлийн ур чадварыг дээшлүүлэх сургалтууд, удирдлагын хөгжлийн хөтөлбөр, гадаад хэлний сургалт, дижитал технологийн сургалтуудыг тогтмол зохион байгуулна.",
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
        glowColor: "rgba(20, 184, 166, 0.4)",
        iconBg: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
        icon: (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        ),
      },
      benefits: {
        key: "benefits",
        title: "Урамшуулал",
        content:
          "Гүйцэтгэлийн урамшуулал, шилдэг ажилтны шагнал, зорилгын урамшуулал, инноваци санаачилгын шагнал зэргийг олгодог.",
        gradient: "from-amber-500 via-orange-500 to-rose-500",
        glowColor: "rgba(249, 115, 22, 0.4)",
        iconBg: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
        icon: (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      health: {
        key: "health",
        title: "Эрүүл мэнд",
        content:
          "Бүрэн хэмжээний эрүүл мэндийн даатгал, жил бүрийн эрүүл мэндийн үзлэг, спорт заалны гишүүнчлэл, сэтгэл зүйн дэмжлэг үзүүлнэ.",
        gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
        glowColor: "rgba(236, 72, 153, 0.4)",
        iconBg: "linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)",
        icon: (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        ),
      },
    };

    setPolicies(defaultPolicies);
  }, []);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // simulate API
    await new Promise((r) => setTimeout(r, 1200));

    setSubmitting(false);
    setSent(true);

    setTimeout(() => {
      setSent(false);
      setShowForm(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        message: "",
      });
      setSelectedJob(null);
    }, 2200);
  };

  const renderPolicyButton = (key: string) => {
    const policy = policies[key];
    if (!policy) return null;

    const isActive = activePolicy === key;

    return (
      <button
        key={key}
        onClick={() => {
          setActivePolicy(isActive ? null : key);
          setExpandJobs(false); // Close jobs when opening policy
        }}
        className="group relative"
        aria-expanded={isActive}
      >
        <div
          className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-500 ${
            isActive ? "opacity-60 scale-110" : "opacity-0 group-hover:opacity-40 group-hover:scale-105"
          }`}
          style={{ background: policy.glowColor }}
        />

        <div
          className={`relative p-5 rounded-2xl text-left transition-all duration-500 overflow-hidden ${
            isActive ? "scale-[1.03]" : "hover:scale-[1.02]"
          }`}
          style={{
            background: isActive
              ? "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.35) 100%)",
            backdropFilter: "blur(30px) saturate(180%)",
            WebkitBackdropFilter: "blur(30px) saturate(180%)",
            boxShadow: isActive
              ? `0 0 0 1px rgba(255,255,255,0.95), 0 0 30px ${policy.glowColor}, 0 10px 40px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,1)`
              : "0 0 0 1px rgba(255,255,255,0.6), 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.8)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          <div
            className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${policy.gradient} transition-all duration-500 ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"
            }`}
          />

          <div className="flex items-center gap-3 relative z-10">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                isActive ? "scale-110 shadow-lg" : "group-hover:scale-105"
              }`}
              style={{
                background: policy.iconBg,
                boxShadow: isActive ? `0 4px 20px ${policy.glowColor}` : "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {policy.icon}
            </div>
            <div className="font-medium text-slate-800">{policy.title}</div>
          </div>

          <div
            className={`absolute bottom-3 left-5 right-5 h-0.5 rounded-full bg-gradient-to-r ${policy.gradient} transition-all duration-500 ${
              isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100"
            }`}
            style={{ transformOrigin: "left" }}
          />

          {isActive && (
            <>
              <div className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r animate-pulse" style={{ background: policy.iconBg, animationDelay: "0s" }} />
              <div className="absolute top-4 right-6 w-1 h-1 rounded-full bg-gradient-to-r animate-pulse" style={{ background: policy.iconBg, animationDelay: "0.3s" }} />
              <div className="absolute bottom-4 right-4 w-1 h-1 rounded-full bg-gradient-to-r animate-pulse" style={{ background: policy.iconBg, animationDelay: "0.6s" }} />
            </>
          )}
        </div>
      </button>
    );
  };

  // ====== FIX: don't collapse expanded details when modal opens ======
  // Previously: `const isExpanded = selectedJob?.id === job.id && !showForm;`
  // Now allow expansion independent of modal visibility.
  const isJobExpanded = (job: Job) => selectedJob?.id === job.id;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-100 to-zinc-100 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/60 via-indigo-100/40 to-purple-100/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute top-1/4 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-cyan-100/50 via-teal-100/30 to-emerald-100/20 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: "10s" }} />
        <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-rose-100/40 via-pink-100/30 to-fuchsia-100/20 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-white/80 to-slate-100/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative">
        <div className="py-20">
          <Container>
            <div className="max-w-3xl mx-auto mb-16">
              <div
                className="mx-auto rounded-[32px] p-8 md:p-12 relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.6) 100%)",
                  backdropFilter: "blur(40px) saturate(200%)",
                  WebkitBackdropFilter: "blur(40px) saturate(200%)",
                  boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.8),
                    0 0 0 2px rgba(255,255,255,0.4),
                    0 8px 40px rgba(0,0,0,0.08),
                    0 20px 60px rgba(0,0,0,0.04),
                    inset 0 1px 1px rgba(255,255,255,0.9),
                    inset 0 -1px 1px rgba(0,0,0,0.02)
                  `,
                }}
                role="region"
                aria-labelledby="hr-hero-title"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                <h1 id="hr-hero-title" className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3 relative">
                  Хүний нөөц
                </h1>
                <p className="text-slate-600 mb-6 relative">
                  Ажилтнаа дэмжсэн бодлого, сургалт болон урамшуулалтай. Хамтран ажиллах чадвартай шинэ хүнийг урьж байна.
                </p>
                
                {/* Application Button */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setForm({ ...form, position: "" });
                      setShowForm(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-xl font-semibold hover:from-slate-700 hover:to-slate-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Анкет бөглөх
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-slate-700">
                  {Object.keys(policies).map(renderPolicyButton)}
                  
                  {/* Jobs Button - Same grid */}
                  {jobs.filter((j) => j.status === "active").length > 0 && (
                    <button
                      onClick={() => {
                        const newExpand = !expandJobs;
                        setExpandJobs(newExpand);
                        if (!newExpand) {
                          setSelectedJob(null);
                        }
                        setActivePolicy(null);
                      }}
                      className="group relative"
                      aria-expanded={expandJobs}
                    >
                      <div
                        className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-500 ${
                          expandJobs ? "opacity-60 scale-110" : "opacity-0 group-hover:opacity-40 group-hover:scale-105"
                        }`}
                        style={{ background: "rgba(71, 85, 105, 0.4)" }}
                      />

                      <div
                        className={`relative p-5 rounded-2xl text-left transition-all duration-500 overflow-hidden ${
                          expandJobs ? "scale-[1.03]" : "hover:scale-[1.02]"
                        }`}
                        style={{
                          background: expandJobs
                            ? "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)"
                            : "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.35) 100%)",
                          backdropFilter: "blur(30px) saturate(180%)",
                          WebkitBackdropFilter: "blur(30px) saturate(180%)",
                          boxShadow: expandJobs
                            ? "0 0 0 1px rgba(255,255,255,0.95), 0 0 30px rgba(71, 85, 105, 0.3), 0 10px 40px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,1)"
                            : "0 0 0 1px rgba(255,255,255,0.6), 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.8)",
                        }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                        <div
                          className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-500 ${
                            expandJobs ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                          }`}
                        />

                        <div className="flex items-center gap-3 relative z-10">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                              expandJobs ? "scale-110 shadow-lg" : "group-hover:scale-105"
                            }`}
                            style={{
                              background: "linear-gradient(135deg, #475569 0%, #334155 100%)",
                              boxShadow: expandJobs ? "0 4px 20px rgba(71, 85, 105, 0.4)" : "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                        <div className="font-medium text-slate-800">
                          Ажлын байр
                        </div>
                        </div>

                        <div
                          className={`absolute bottom-3 left-5 right-5 h-0.5 rounded-full bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-500 ${
                            expandJobs ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100"
                          }`}
                          style={{ transformOrigin: "left" }}
                        />

                        {expandJobs && (
                          <>
                            <div className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "linear-gradient(135deg, #475569 0%, #334155 100%)", animationDelay: "0s" }} />
                            <div className="absolute top-4 right-6 w-1 h-1 rounded-full animate-pulse" style={{ background: "linear-gradient(135deg, #475569 0%, #334155 100%)", animationDelay: "0.3s" }} />
                            <div className="absolute bottom-4 right-4 w-1 h-1 rounded-full animate-pulse" style={{ background: "linear-gradient(135deg, #475569 0%, #334155 100%)", animationDelay: "0.6s" }} />
                          </>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable policy content */}
              {activePolicy && policies[activePolicy] && (
                <div
                  className="mt-6 p-6 rounded-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.5) 100%)",
                    backdropFilter: "blur(40px) saturate(200%)",
                    WebkitBackdropFilter: "blur(40px) saturate(200%)",
                    boxShadow: `
                      0 0 0 1px rgba(255,255,255,0.8),
                      0 10px 40px rgba(0,0,0,0.1),
                      inset 0 1px 1px rgba(255,255,255,0.9)
                    `,
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${policies[activePolicy].gradient}`} />
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                      style={{
                        background: policies[activePolicy].iconBg,
                        boxShadow: `0 4px 20px ${policies[activePolicy].glowColor}`,
                      }}
                    >
                      {policies[activePolicy].icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 relative z-10">{policies[activePolicy].title}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed relative z-10 pl-13">{policies[activePolicy].content}</p>
                </div>
              )}

              {/* Jobs List - Expandable */}
              {expandJobs && jobs.filter((j) => j.status === "active").length > 0 && (
                <div className="mt-6 max-w-4xl mx-auto space-y-4 animate-in slide-in-from-top duration-300">
                  {jobs
                    .filter((j) => j.status === "active")
                    .map((job, index) => {
                      const isExpanded = isJobExpanded(job);

                      return (
                        <div
                          key={job.id}
                          className="rounded-2xl relative overflow-hidden transition-all duration-300 z-10"
                          style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)",
                            backdropFilter: "blur(30px) saturate(180%)",
                            WebkitBackdropFilter: "blur(30px) saturate(180%)",
                            boxShadow: `
                              0 0 0 1px rgba(255,255,255,0.8),
                              0 4px 20px rgba(0,0,0,0.06),
                              inset 0 1px 1px rgba(255,255,255,0.9)
                            `,
                          }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                          {/* Gradient accent bar */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 to-slate-800" />

                          <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  {/* Job Icon */}
                                  <div 
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{
                                      background: "linear-gradient(135deg, #475569 0%, #334155 100%)",
                                      boxShadow: "0 4px 20px rgba(71, 85, 105, 0.3)",
                                    }}
                                  >
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold">{index + 1}</span>
                                      <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 ml-13">
                                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-sm rounded-full text-slate-600 border border-slate-200/50 shadow-sm">{job.department}</span>
                                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-sm rounded-full text-slate-600 border border-slate-200/50 shadow-sm">{job.type}</span>
                                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-sm rounded-full text-slate-600 border border-slate-200/50 shadow-sm">{job.location}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                              <span className="text-sm text-slate-500">Хүлээн авах хугацаа: {job.deadline}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    // toggle expansion independently of modal
                                    if (isExpanded) {
                                      setSelectedJob(null);
                                    } else {
                                      setSelectedJob(job);
                                    }
                                  }}
                                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-1"
                                >
                                  {isExpanded ? "Хураах" : "Дэлгэрэнгүй"}
                                  <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedJob(job);
                                    setForm({ ...form, position: job.title });
                                    setShowForm(true);
                                  }}
                                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                                >
                                  Анкет бөглөх
                                </button>
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="px-6 pb-6 pt-0 border-t border-slate-200/50 bg-gradient-to-b from-slate-50/50 to-transparent relative z-20">
                              <div className="pt-6 space-y-6">
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-slate-200/50">
                                  <h4 className="font-semibold text-slate-900 mb-2 text-lg">Ажлын тайлбар</h4>
                                  <p className="text-slate-600 leading-relaxed">{job.description}</p>
                                </div>

                                {job.requirements && (
                                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-slate-200/50">
                                    <h4 className="font-semibold text-slate-900 mb-2 text-lg">Шаардлага</h4>
                                    <div className="text-slate-600 leading-relaxed whitespace-pre-line">{job.requirements}</div>
                                  </div>
                                )}

                                <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-5 text-white">
                                  <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      </div>
                                      <div>
                                        <p className="text-sm text-white/70">Хүлээн авах хугацаа</p>
                                        <p className="font-medium">{job.deadline}</p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setForm({ ...form, position: job.title });
                                        setShowForm(true);
                                      }}
                                      className="px-6 py-3 bg-white text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2"
                                    >
                                      Анкет бөглөх
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </Container>
        </div>
      </div>

      {/* Application Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-title"
        >
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(100,116,139,0.2)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
            }}
            onClick={() => setShowForm(false)}
          />

          <div
            className="relative max-w-xl w-full rounded-[32px] overflow-hidden z-60"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)",
              backdropFilter: "blur(50px) saturate(200%)",
              WebkitBackdropFilter: "blur(50px) saturate(200%)",
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.9),
                0 0 0 2px rgba(255,255,255,0.5),
                0 24px 80px rgba(0,0,0,0.15),
                0 8px 24px rgba(0,0,0,0.08),
                inset 0 1px 2px rgba(255,255,255,1),
                inset 0 -1px 2px rgba(0,0,0,0.02)
              `,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
            <div className="p-8 relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 id="apply-title" className="text-2xl font-semibold text-slate-900">
                    Анкет бөглөх
                  </h3>
                  <p className="text-slate-900 mt-1 font-medium">{selectedJob?.title || form.position}</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  aria-label="Хаах"
                  className="p-2 rounded-xl transition text-slate-400 hover:text-slate-600"
                  style={{
                    background: "rgba(255,255,255,0.5)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {sent ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-xl font-semibold text-slate-900 mb-2">Амжилттай илгээгдлээ!</div>
                  <div className="text-slate-500">Бид таныг удахгүй холбогдох болно.</div>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Нэр *"
                      required
                      className="w-full px-4 py-3.5 rounded-xl outline-none transition"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.8), inset 0 2px 4px rgba(0,0,0,0.03)",
                      }}
                    />
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Овог *"
                      required
                      className="w-full px-4 py-3.5 rounded-xl outline-none transition"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.8), inset 0 2px 4px rgba(0,0,0,0.03)",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Имэйл *"
                      required
                      className="w-full px-4 py-3.5 rounded-xl outline-none transition"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.8), inset 0 2px 4px rgba(0,0,0,0.03)",
                      }}
                    />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Утас *"
                      required
                      className="w-full px-4 py-3.5 rounded-xl outline-none transition"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.8), inset 0 2px 4px rgba(0,0,0,0.03)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Туршлага *</label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 rounded-xl outline-none transition"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.8), inset 0 2px 4px rgba(0,0,0,0.03)",
                      }}
                    >
                      <option value="">Сонгох</option>
                      <option value="0-1">0-1 жил</option>
                      <option value="1-3">1-3 жил</option>
                      <option value="3-5">3-5 жил</option>
                      <option value="5+">5+ жил</option>
                    </select>
                  </div>

                  <div>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Танилцуулга / Хүсэлт (сонголттой)"
                      className="w-full px-4 py-3.5 rounded-xl outline-none transition resize-none"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.8), inset 0 2px 4px rgba(0,0,0,0.03)",
                      }}
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-5 py-3.5 rounded-xl font-medium text-slate-600 transition"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.8), 0 4px 12px rgba(0,0,0,0.04)",
                      }}
                    >
                      Болих
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-5 py-3.5 text-white rounded-xl font-medium transition disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.1)",
                      }}
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                          </svg>
                          Илгээж байна...
                        </span>
                      ) : (
                        "Илгээх"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="py-12" />
    </main>
  );
}
