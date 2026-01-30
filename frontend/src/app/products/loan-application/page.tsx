"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import Link from "next/link";

const loanTypes = [
  { value: "", label: "Сонгох" },
  { value: "car-eco", label: "Автомашин худалдан авах /Улсын дугааргүй - ЭКО/" },
  { value: "car-no-plate", label: "Автомашин худалдан авах /Улсын дугааргүй/" },
  { value: "car-with-plate", label: "Автомашин худалдан авах /Улсын дугаартай/" },
  { value: "land-garage", label: "ГАЗАР, ГРАЖ БАРЬЦААЛСАН ЗЭЭЛ" },
  { value: "phone-8811", label: "8811 ДУГААР БАРЬЦААЛСАН ЗЭЭЛ" },
  { value: "phone-9911", label: "9911 ДУГААР БАРЬЦААЛСАН ЗЭЭЛ" },
  { value: "fence-house", label: "ХАШАА БАЙШИН, ОБЬЕКТ БАРЬЦААЛСАН ЗЭЭЛ" },
  { value: "apartment", label: "ОРОН СУУЦ БАРЬЦААЛСАН ЗЭЭЛ" },
  { value: "parking-car", label: "ЗОГСООЛ-АВТОМАШИН БАРЬЦААЛСАН ЗЭЭЛ" },
  { value: "unah-car", label: "УНАХ-АВТОМАШИН БАРЬЦААЛСАН ЗЭЭЛ" },
];

function LoanApplicationForm() {
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get("type") || "";

  const [form, setForm] = useState({
    loanType: preselectedType,
    lastName: "",
    firstName: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.loanType) {
      newErrors.loanType = "Зээлийн төрөл сонгоно уу";
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = "Овог оруулна уу";
    }
    if (!form.firstName.trim()) {
      newErrors.firstName = "Нэр оруулна уу";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Утасны дугаар оруулна уу";
    } else if (!/^\d{8}$/.test(form.phone.trim())) {
      newErrors.phone = "Зөв утасны дугаар оруулна уу (8 оронтой)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setSubmitting(true);

    // simulate API
    await new Promise((r) => setTimeout(r, 1500));

    setSubmitting(false);
    setSent(true);
  };

  const resetForm = () => {
    setSent(false);
    setForm({
      loanType: "",
      lastName: "",
      firstName: "",
      phone: "",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/50 via-indigo-100/30 to-purple-100/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-cyan-100/40 via-teal-100/20 to-emerald-100/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-100/30 via-orange-100/20 to-rose-100/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '14s' }} />
      </div>

            {/* Fixed back button - bottom right - responsive */}
      <Link 
        href="/"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-full text-slate-700 hover:text-slate-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm sm:text-base"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.9)',
        }}
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Буцах
      </Link>

      <div className="relative py-10 sm:py-16 md:py-20 px-4 sm:px-6">
        <Container>
          <div className="max-w-lg mx-auto">
            {/* Form Card */}
            <div
              className="rounded-2xl sm:rounded-[28px] p-5 sm:p-8 md:p-10 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 100%)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                boxShadow: `
                  0 0 0 1px rgba(255,255,255,0.9),
                  0 0 0 2px rgba(255,255,255,0.5),
                  0 20px 60px rgba(0,0,0,0.08),
                  0 8px 24px rgba(0,0,0,0.04),
                  inset 0 1px 2px rgba(255,255,255,1)
                `,
              }}
            >
              {/* Glass effects */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
              <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

              {sent ? (
                <div className="py-8 text-center relative z-10">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    Хүсэлт амжилттай илгээгдлээ!
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Бид таны хүсэлтийг хүлээн авлаа. Удахгүй таньтай холбогдох болно.
                  </p>
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-700 transition-all"
                  >
                    Шинэ хүсэлт илгээх
                  </button>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                      Зээлийн хүсэлт
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">
                      Мэдээллээ оруулснаар бид таньтай холбогдох болно
                    </p>
                  </div>

                  <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                    {/* Loan Type Select */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Зээлийн төрөл <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="loanType"
                        value={form.loanType}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl outline-none transition text-slate-800 text-sm sm:text-base ${
                          errors.loanType ? 'ring-2 ring-rose-500' : ''
                        }`}
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 100%)',
                          boxShadow: '0 0 0 1px rgba(255,255,255,0.9), inset 0 2px 4px rgba(0,0,0,0.03)',
                        }}
                      >
                        {loanTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.loanType && (
                        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-rose-500">{errors.loanType}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Овог <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Овог"
                        className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl outline-none transition text-sm sm:text-base ${
                          errors.lastName ? 'ring-2 ring-rose-500' : ''
                        }`}
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 100%)',
                          boxShadow: '0 0 0 1px rgba(255,255,255,0.9), inset 0 2px 4px rgba(0,0,0,0.03)',
                        }}
                      />
                      {errors.lastName && (
                        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-rose-500">{errors.lastName}</p>
                      )}
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Нэр <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Нэр"
                        className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl outline-none transition text-sm sm:text-base ${
                          errors.firstName ? 'ring-2 ring-rose-500' : ''
                        }`}
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 100%)',
                          boxShadow: '0 0 0 1px rgba(255,255,255,0.9), inset 0 2px 4px rgba(0,0,0,0.03)',
                        }}
                      />
                      {errors.firstName && (
                        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-rose-500">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Утасны дугаар <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="9900 0000"
                        type="tel"
                        inputMode="numeric"
                        maxLength={8}
                        className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl outline-none transition text-sm sm:text-base ${
                          errors.phone ? 'ring-2 ring-rose-500' : ''
                        }`}
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 100%)',
                          boxShadow: '0 0 0 1px rgba(255,255,255,0.9), inset 0 2px 4px rgba(0,0,0,0.03)',
                        }}
                      />
                      {errors.phone && (
                        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-rose-500">{errors.phone}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 text-white rounded-xl font-semibold transition-all disabled:opacity-50 mt-4 sm:mt-6 text-sm sm:text-base"
                      style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.1)',
                      }}
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                          </svg>
                          Илгээж байна...
                        </span>
                      ) : (
                        "Хүсэлт илгээх"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Info text */}
            <p className="text-center text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6 pb-16 sm:pb-0">
              Таны мэдээлэл нууцлалтай хадгалагдана
            </p>
          </div>
        </Container>
      </div>
    </main>
  );
}

export default function LoanApplicationPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-600">Уншиж байна...</p>
        </div>
      </main>
    }>
      <LoanApplicationForm />
    </Suspense>
  );
}
