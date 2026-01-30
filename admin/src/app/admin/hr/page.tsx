'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Modal from '@/components/Modal';
import { Input, Textarea, Button } from '@/components/FormElements';
import { PlusIcon, TrashIcon, PencilIcon, BriefcaseIcon, CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useSaveReset } from '@/hooks/useSaveReset';
import { SaveResetButtons } from '@/components/SaveResetButtons';
import { useLanguage } from '@/contexts/LanguageContext';

interface Job {
  id: string;
  title: string;
  title_en?: string;
  department: string;
  department_en?: string;
  type: string;
  location: string;
  description: string;
  description_en?: string;
  requirements?: string;
  requirements_en?: string;
  deadline: string;
  status: string;
}

interface Policy {
  key: string;
  title: string;
  title_en?: string;
  content: string;
  content_en?: string;
  gradient: string;
  glowColor?: string;
  iconBg?: string;
  icon?: string;
  textColor?: string;
  fontSize?: string;
  backgroundColor?: string;
}

const defaultJobs: Job[] = [
  {
    id: '1',
    title: 'Зээлийн мэргэжилтэн',
    department: 'Зээлийн хэлтэс',
    type: 'Бүтэн цагийн',
    location: 'Улаанбаатар',
    description: 'Зээлийн хүсэлтийг хүлээн авч, шинжилгээ хийх, зээл олгох үйл ажиллагаанд оролцох.',
    requirements: '• Санхүү, эдийн засгийн чиглэлээр дээд боловсролтой\n• 2+ жилийн туршлагатай\n• Монгол, Англи хэлээр чөлөөтэй\n• MS Office-ийн advanced түвшин',
    deadline: '2025-12-31',
    status: 'active',
  },
  {
    id: '2',
    title: 'Кассчин',
    department: 'Үйлчилгээний хэлтэс',
    type: 'Бүтэн цагийн',
    location: 'Дархан',
    description: 'Мөнгөн гүйлгээний үйлчилгээ үзүүлэх, харилцагчдад зөвлөгөө өгөх.',
    requirements: '• Дунд боловсролтой\n• Үйлчилгээний туршлага давуу тал\n• Харилцааны чадвар сайн\n• Компьютер ашиглах чадвартай',
    deadline: '2025-12-15',
    status: 'active',
  },
];

const defaultPolicies: Record<string, Policy> = {
  equal: {
    key: 'equal',
    title: 'Тэгш боломж',
    content: 'Бүх ажилтанд ижил боломж, шударга хандлагыг баримтална. Хүйс, нас, үндэс угсаа, шашин шүтлэгээс үл хамааран бүх ажилтныг тэгш эрхтэйгээр хүлээн зөвшөөрдөг.',
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    iconBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    icon: 'equal',
    textColor: '#334155',
    fontSize: '1rem',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  training: {
    key: 'training',
    title: 'Сургалт',
    content: 'Мэргэжлийн ур чадварыг дээшлүүлэх сургалтууд, удирдлагын хөгжлийн хөтөлбөр, гадаад хэлний сургалт, дижитал технологийн сургалтуудыг тогтмол зохион байгуулна.',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    iconBg: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    icon: 'training',
    textColor: '#334155',
    fontSize: '1rem',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  benefits: {
    key: 'benefits',
    title: 'Урамшуулал',
    content: 'Гүйцэтгэлийн урамшуулал, шилдэг ажилтны шагнал, зорилгын урамшуулал, инноваци санаачилгын шагнал зэргийг олгодог.',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    iconBg: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    icon: 'benefits',
    textColor: '#334155',
    fontSize: '1rem',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  health: {
    key: 'health',
    title: 'Эрүүл мэнд',
    content: 'Бүрэн хэмжээний эрүүл мэндийн даатгал, жил бүрийн эрүүл мэндийн үзлэг, спорт заалны гишүүнчлэл, сэтгэл зүйн дэмжлэг үзүүлнэ.',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    iconBg: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
    icon: 'health',
    textColor: '#334155',
    fontSize: '1rem',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
};

const POLICY_ICONS: Record<string, React.ReactNode> = {
  equal: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  training: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  benefits: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  health: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  insurance: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  retirement: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  vacation: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  flexible: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  childcare: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  wellness: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m-9-1a9 9 0 0118 0 9 9 0 01-18 0z" />
    </svg>
  ),
  transport: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
};

export default function HRPage() {
  const { language, setLanguage, t } = useLanguage();
  
  // Translation object
  const trans = {
    title: t('Хүний нөөц удирдлага', 'HR Management'),
    subtitle: t('Ажлын байр болон HR бодлого удирдах', 'Manage Jobs and HR Policies'),
    back: t('Буцах', 'Back'),
    save: t('Хадгалах', 'Save'),
    cancel: t('Цуцлах', 'Cancel'),
    totalJobs: t('Нийт ажлын байр', 'Total Jobs'),
    activeListings: t('Идэвхтэй зар', 'Active Listings'),
    totalPolicies: t('HR Бодлого', 'HR Policies'),
    addPolicy: t('Шинэ бодлого нэмэх', 'Add New Policy'),
    addJob: t('Шинэ зар нэмэх', 'Add New Job'),
    jobTitle: t('Ажлын байрны нэр', 'Job Title'),
    department: t('Хэлтэс', 'Department'),
    type: t('Төрөл', 'Type'),
    location: t('Байршил', 'Location'),
    deadline: t('Дуусах хугацаа', 'Deadline'),
    description: t('Тайлбар', 'Description'),
    requirements: t('Шаардлага', 'Requirements'),
    status: t('Статус', 'Status'),
    active: t('Идэвхтэй', 'Active'),
    closed: t('Хаагдсан', 'Closed'),
    jobListings: t('Ажлын байрны зар', 'Job Listings'),
    policyListings: t('HR Бодлого', 'HR Policies'),
    key: t('Key (англи үсэг, зураасгүй)', 'Key (letters only)'),
    policyTitle: t('Гарчиг', 'Title'),
    policyContent: t('Агуулга', 'Content'),
    icon: t('Дүрслэлийн сонголт', 'Icon Selection'),
    gradient: t('Gradient', 'Gradient'),
    textStyle: t('Текстийн стиль', 'Text Style'),
    textColor: t('Текстийн өнгө', 'Text Color'),
    fontSize: t('Фонтын хэмжээ', 'Font Size'),
    bgColor: t('Фондын өнгө', 'Background Color'),
  };

  const { 
    data: hrData, 
    setData: setHrData, 
    saveSuccess, 
    handleSave: saveData, 
    handleReset 
  } = useSaveReset<{ jobs: Job[], policies: Record<string, Policy> }>('hrContent', { jobs: defaultJobs, policies: defaultPolicies });
  
  const jobs = hrData.jobs;
  const policies = hrData.policies;
  
  const setJobs = (newJobs: Job[] | ((prev: Job[]) => Job[])) => {
    const updatedJobs = typeof newJobs === 'function' ? newJobs(hrData.jobs) : newJobs;
    setHrData({ ...hrData, jobs: updatedJobs });
  };
  
  const setPolicies = (newPolicies: Record<string, Policy> | ((prev: Record<string, Policy>) => Record<string, Policy>)) => {
    const updatedPolicies = typeof newPolicies === 'function' ? newPolicies(hrData.policies) : newPolicies;
    setHrData({ ...hrData, policies: updatedPolicies });
  };
  
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const [expandJobs, setExpandJobs] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [modalMode, setModalMode] = useState<'job' | 'policy'>('job');

  const [jobFormData, setJobFormData] = useState<Job>({
    id: '',
    title: '',
    department: '',
    type: 'Бүтэн цагийн',
    location: '',
    description: '',
    requirements: '',
    deadline: '',
    status: 'active',
  });

  const [policyFormData, setPolicyFormData] = useState<Policy>({
    key: '',
    title: '',
    content: '',
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
  });

  const handleOpenJobModal = (job?: Job) => {
    setModalMode('job');
    if (job) {
      setEditingJob(job);
      setJobFormData(job);
    } else {
      setEditingJob(null);
      setJobFormData({
        id: '',
        title: '',
        department: '',
        type: 'Бүтэн цагийн',
        location: '',
        description: '',
        requirements: '',
        deadline: '',
        status: 'active',
      });
    }
    setModalOpen(true);
  };

  const handleSaveJob = () => {
    if (editingJob) {
      setJobs((prev) => prev.map((j: Job) => j.id === editingJob.id ? jobFormData : j));
    } else {
      setJobs((prev) => [...prev, { ...jobFormData, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const handleDeleteJob = (id: string) => {
    if (!confirm('Устгах уу?')) return;
    setJobs((prev) => prev.filter((j: Job) => j.id !== id));
  };

  const handleOpenPolicyModal = (policy?: Policy) => {
    setModalMode('policy');
    if (policy) {
      setEditingPolicy(policy);
      setPolicyFormData(policy);
    } else {
      setEditingPolicy(null);
      setPolicyFormData({
        key: '',
        title: '',
        content: '',
        gradient: 'from-blue-500 via-indigo-500 to-purple-500',
        glowColor: 'rgba(99, 102, 241, 0.4)',
        iconBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        icon: 'equal',
        textColor: '#334155',
        fontSize: '1rem',
        backgroundColor: 'rgba(255,255,255,0.75)',
      });
    }
    setModalOpen(true);
  };

  const handleSavePolicy = () => {
    const key = editingPolicy ? editingPolicy.key : policyFormData.key;
    setPolicies((prev) => ({ ...prev, [key]: { ...policyFormData, key } }));
    setModalOpen(false);
  };

  const handleDeletePolicy = (key: string) => {
    if (!confirm('Устгах уу?')) return;
    setPolicies((prev) => {
      const newPolicies = { ...prev };
      delete newPolicies[key];
      return newPolicies;
    });
  };

  const isJobExpanded = (job: Job) => selectedJob?.id === job.id;

  const renderPolicyButton = (key: string) => {
    const policy = policies[key];
    if (!policy) return null;

    const isActive = activePolicy === key;
    const glowColor = policy.glowColor || 'rgba(99, 102, 241, 0.4)';
    const iconBg = policy.iconBg || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';

    return (
      <button
        key={key}
        onClick={() => {
          setActivePolicy(isActive ? null : key);
          setExpandJobs(false);
        }}
        className="group relative"
        aria-expanded={isActive}
      >
        <div
          className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-500 ${
            isActive ? "opacity-60 scale-110" : "opacity-0 group-hover:opacity-40 group-hover:scale-105"
          }`}
          style={{ background: glowColor }}
        />

        <div
          className={`relative p-4 rounded-lg text-left transition-all duration-300 border ${
            isActive ? "border-slate-300 bg-white shadow-md scale-[1.02]" : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 relative z-10">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0`}
                style={{
                  background: iconBg,
                }}
              >
                {POLICY_ICONS[key]}
              </div>
              <div className="font-medium text-slate-700 text-sm">{policy.title}</div>
            </div>
          </div>

          <div
            className={`absolute bottom-3 left-5 right-5 h-0.5 rounded-full bg-linear-to-r ${policy.gradient} transition-all duration-500 ${
              isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100"
            }`}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </button>
    );
  };

  return (
    <AdminLayout title="Хүний нөөц удирдлага">
      <div className="min-h-screen bg-slate-50 relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-linear-to-br from-slate-200/40 via-slate-200/20 to-slate-100/10 rounded-full blur-[100px]" style={{ animationDuration: "8s" }} />
          <div className="absolute top-1/4 -left-40 w-[400px] h-[400px] bg-linear-to-br from-slate-200/30 via-slate-200/15 to-slate-100/5 rounded-full blur-[80px]" style={{ animationDuration: "10s" }} />
        </div>

        <div className="relative px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2">{trans.title}</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 rounded-lg p-1.5 border border-slate-300 shadow-sm">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setLanguage('mn')}
                      title="Монгол хэл"
                      className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                        language === 'mn'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                    >
                      🇲🇳 
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      title="English"
                      className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                        language === 'en'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                    >
                      🇺🇸 EN
                    </button>
                  </div>
                </div>
                <SaveResetButtons 
                  onSave={saveData}
                  onReset={handleReset}
                  confirmMessage={t('Та хадгалахдаа итгэлтэй байна уу?', 'Are you sure you want to save?')}
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-900">{t('Амжилттай хадгалагдлаа!', 'Saved successfully!')}</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">{t('Өөрчлөлтүүд хадгалагдсан.', 'Changes saved.')}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">{trans.totalJobs}</p>
                  <p className="text-3xl font-bold text-slate-900">{jobs.length}</p>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg">
                  <BriefcaseIcon className="h-7 w-7 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">{trans.activeListings}</p>
                  <p className="text-3xl font-bold text-slate-900">{jobs.filter((j: Job) => j.status === 'active').length}</p>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg">
                  <CheckCircleIcon className="h-7 w-7 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">{trans.totalPolicies}</p>
                  <p className="text-3xl font-bold text-slate-900">{Object.keys(policies).length}</p>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg">
                  <ShieldCheckIcon className="h-7 w-7 text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">{trans.policyListings}</h2>
              <Button onClick={() => handleOpenPolicyModal()} variant="primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                {trans.addPolicy}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-slate-700">
              {Object.keys(policies).map(renderPolicyButton)}
            </div>
          </div>

          {activePolicy && policies[activePolicy] && (
            <div
              className="mb-8 p-6 rounded-xl border border-slate-200 bg-white animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: policies[activePolicy].iconBg || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    }}
                  >
                    {POLICY_ICONS[policies[activePolicy].icon || activePolicy]}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{policies[activePolicy].title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleOpenPolicyModal(policies[activePolicy]);
                    }}
                    className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Засах / Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={saveData}
                    className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Хадгалах / Save"
                  >
                  </button>
                  <button
                    onClick={() => handleDeletePolicy(activePolicy)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p 
                className="leading-relaxed" 
                style={{
                  color: policies[activePolicy].textColor || '#334155',
                  fontSize: policies[activePolicy].fontSize || '1rem',
                  backgroundColor: policies[activePolicy].backgroundColor || 'transparent',
                  padding: policies[activePolicy].backgroundColor ? '0.5rem 0.75rem' : '0',
                  borderRadius: policies[activePolicy].backgroundColor ? '0.375rem' : '0',
                }}
              >
                {policies[activePolicy].content}
              </p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">{trans.jobListings}</h2>
              <Button onClick={() => handleOpenJobModal()} variant="primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                {trans.addJob}
              </Button>
            </div>

            {jobs.length > 0 && (
              <div className="space-y-4">
                {jobs.map((job: Job, index: number) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-slate-200 bg-white transition-all duration-300 z-10"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                              style={{ background: "linear-gradient(135deg, #475569 0%, #334155 100%)", boxShadow: "0 4px 20px rgba(71, 85, 105, 0.3)" }}
                            >
                              <BriefcaseIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold">{index + 1}</span>
                                <h3 className="text-xl font-semibold text-slate-900">{language === 'en' ? (job.title_en || job.title) : job.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {job.status === 'active' ? 'Идэвхтэй' : 'Хаагдсан'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 ml-13">
                            <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-sm rounded-full text-slate-600 border border-slate-200/50 shadow-sm">{language === 'en' ? (job.department_en || job.department) : job.department}</span>
                            <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-sm rounded-full text-slate-600 border border-slate-200/50 shadow-sm">{job.type}</span>
                            <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-sm rounded-full text-slate-600 border border-slate-200/50 shadow-sm">{job.location}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => handleOpenJobModal(job)} 
                            className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Засах / Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteJob(job.id)} 
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Устгах / Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <span className="text-sm text-slate-600">{t('Хүлээн авах хугацаа', 'Deadline')}: {job.deadline}</span>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-0 border-t border-slate-200 bg-slate-50">
                      <div className="pt-5 space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <h4 className="font-semibold text-slate-900 mb-2">{t('Ажлын тайлбар', 'Job Description')}</h4>
                          <p className="text-slate-600 leading-relaxed text-sm">{language === 'en' ? (job.description_en || job.description) : job.description}</p>
                        </div>
                        {(language === 'en' ? job.requirements_en : job.requirements) && (
                          <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <h4 className="font-semibold text-slate-900 mb-2">{t('Шаардлага', 'Requirements')}</h4>
                            <div className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">{language === 'en' ? job.requirements_en : job.requirements}</div>
                          </div>
                        )}
                        <div className="bg-slate-800 rounded-lg p-4 text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-white/70">Хүлээн авах хугацаа</p>
                              <p className="font-medium">{job.deadline}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {modalOpen && (
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'policy' ? (editingPolicy ? t('Бодлого засах', 'Edit Policy') : t('Шинэ бодлого нэмэх', 'Add New Policy')) : (editingJob ? t('Зар засах', 'Edit Job Listing') : t('Шинэ зар нэмэх', 'Add New Job'))}>
              {modalMode === 'job' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Нэр (Монгол)</label>
                      <Input value={jobFormData.title} onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })} placeholder="Зээлийн мэргэжилтэн" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Нэр (English)</label>
                      <Input value={jobFormData.title_en || ''} onChange={(e) => setJobFormData({ ...jobFormData, title_en: e.target.value })} placeholder="Loan Specialist" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Хэлтэс (Монгол)</label>
                      <Input value={jobFormData.department} onChange={(e) => setJobFormData({ ...jobFormData, department: e.target.value })} placeholder="Зээлийн хэлтэс" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Хэлтэс (English)</label>
                      <Input value={jobFormData.department_en || ''} onChange={(e) => setJobFormData({ ...jobFormData, department_en: e.target.value })} placeholder="Loan Department" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{trans.type}</label>
                      <select value={jobFormData.type} onChange={(e) => setJobFormData({ ...jobFormData, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option>Бүтэн цагийн</option>
                        <option>Хагас цагийн</option>
                        <option>Гэрээт</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <Input value={jobFormData.location} onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })} placeholder="Ulaanbaatar" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Тайлбар (Монгол)</label>
                    <Textarea value={jobFormData.description} onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })} rows={3} placeholder="Ажлын байрны товч тайлбар" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label>
                    <Textarea value={jobFormData.description_en || ''} onChange={(e) => setJobFormData({ ...jobFormData, description_en: e.target.value })} rows={3} placeholder="Brief job description" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Шаардлага (Монгол)</label>
                    <Textarea value={jobFormData.requirements || ''} onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })} rows={3} placeholder="• Боловсрол&#10;• Туршлага&#10;• Ур чадвар" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (English)</label>
                    <Textarea value={jobFormData.requirements_en || ''} onChange={(e) => setJobFormData({ ...jobFormData, requirements_en: e.target.value })} rows={3} placeholder="• Education&#10;• Experience&#10;• Skills" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Input label={trans.deadline} type="date" value={jobFormData.deadline} onChange={(e) => setJobFormData({ ...jobFormData, deadline: e.target.value })} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{trans.status}</label>
                      <select value={jobFormData.status} onChange={(e) => setJobFormData({ ...jobFormData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option value="active">{trans.active}</option>
                        <option value="closed">{trans.closed}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button onClick={() => setModalOpen(false)} variant="secondary">{t('Цуцлах', 'Cancel')}</Button>
                    <Button onClick={handleSaveJob} variant="primary">{t('Хадгалах', 'Save')}</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  <Input label={trans.key} value={policyFormData.key} onChange={(e) => setPolicyFormData({ ...policyFormData, key: e.target.value.toLowerCase().replace(/[^a-z]/g, '') })} placeholder="equal" disabled={!!editingPolicy} />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Нэр (Монгол)</label>
                      <Input value={policyFormData.title} onChange={(e) => setPolicyFormData({ ...policyFormData, title: e.target.value })} placeholder="Тэгш боломж" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Нэр (English)</label>
                      <Input value={policyFormData.title_en || ''} onChange={(e) => setPolicyFormData({ ...policyFormData, title_en: e.target.value })} placeholder="Equal Opportunity" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Тайлбар (Монгол)</label>
                    <Textarea value={policyFormData.content} onChange={(e) => setPolicyFormData({ ...policyFormData, content: e.target.value })} rows={3} placeholder="Бодлогын дэлгэрэнгүй тайлбар" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Тайлбар (English)</label>
                    <Textarea value={policyFormData.content_en || ''} onChange={(e) => setPolicyFormData({ ...policyFormData, content_en: e.target.value })} rows={3} placeholder="Detailed policy description" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дүрслэлийн сонголт</label>
                    <select value={policyFormData.icon || 'equal'} onChange={(e) => setPolicyFormData({ ...policyFormData, icon: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option value="equal">Тэгш боломж</option>
                      <option value="training">Сургалт & Хөгжил</option>
                      <option value="benefits">Урамшуулал</option>
                      <option value="health">Эрүүл мэнд</option>
                      <option value="insurance">Даатгал</option>
                      <option value="retirement">Нөхөрлөл</option>
                      <option value="vacation">Амралт & Чөлөө</option>
                      <option value="flexible">Уян цаг</option>
                      <option value="childcare">Хүүхэлгэлүүлэлт</option>
                      <option value="wellness">Сайн сайхны программ</option>
                      <option value="transport">Тээвэр</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gradient</label>
                    <select value={policyFormData.gradient} onChange={(e) => setPolicyFormData({ ...policyFormData, gradient: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option value="from-blue-500 via-indigo-500 to-purple-500">Цэнхэр-Индиго-Нил</option>
                      <option value="from-emerald-500 via-teal-500 to-cyan-500">Ногоон-Шар ногоон-Цэнхэр</option>
                      <option value="from-amber-500 via-orange-500 to-rose-500">Шар-Улбар шар-Улаан</option>
                      <option value="from-rose-500 via-pink-500 to-fuchsia-500">Ягаан-Улаан</option>
                    </select>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 text-sm">Текстийн стиль</h4>
                    
                    <Input 
                      label="Текстийн өнгө" 
                      type="color" 
                      value={policyFormData.textColor || '#334155'} 
                      onChange={(e) => setPolicyFormData({ ...policyFormData, textColor: e.target.value })} 
                      placeholder="#334155" 
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Фонтын хэмжээ</label>
                      <select value={policyFormData.fontSize || '1rem'} onChange={(e) => setPolicyFormData({ ...policyFormData, fontSize: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option value="0.875rem">Жижиг (14px)</option>
                        <option value="1rem">Ердийн (16px)</option>
                        <option value="1.125rem">Дээд (18px)</option>
                        <option value="1.25rem">Том (20px)</option>
                      </select>
                    </div>

                    <Input 
                      label="Фондын өнгө" 
                      type="color" 
                      value={policyFormData.backgroundColor || 'rgba(255,255,255,0.75)'} 
                      onChange={(e) => setPolicyFormData({ ...policyFormData, backgroundColor: e.target.value })} 
                      placeholder="rgba(255,255,255,0.75)" 
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button onClick={() => setModalOpen(false)} variant="secondary">{t('Цуцлах', 'Cancel')}</Button>
                    <Button onClick={handleSavePolicy} variant="primary">{t('Хадгалах', 'Save')}</Button>
                  </div>
                </div>
              )}
            </Modal>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
