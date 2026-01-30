'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import LoanCalculator from '@/components/LoanCalculator';
import { SaveResetButtons } from '@/components/SaveResetButtons';
import { useLanguage } from '@/contexts/LanguageContext';

interface CalculatorConfig {
  id: string;
  defaultAmount: string;
  defaultRate: string;
  defaultTerm: string;
  maxAmount: number;
  maxTerm: number;
  minRate: number;
  maxRate: number;
  // Styling
  labelColor: string;
  labelFontSize: number;
  inputTextColor: string;
  inputFontSize: number;
  inputBgColor: string;
  inputBorderColor: string;
  createdAt: string;
  updatedAt: string;
}

const defaultConfig: CalculatorConfig = {
  id: 'default',
  defaultAmount: '10000000',
  defaultRate: '2.5',
  defaultTerm: '12',
  maxAmount: 100000000,
  maxTerm: 60,
  minRate: 0.5,
  maxRate: 5.0,
  // Styling defaults
  labelColor: '#1f2937',
  labelFontSize: 14,
  inputTextColor: '#1f2937',
  inputFontSize: 16,
  inputBgColor: '#ffffff',
  inputBorderColor: '#e5e7eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function CalculatorPage() {
  const { setLanguage } = useLanguage();
  const language = 'mn';
  const [config, setConfig] = useState<CalculatorConfig>(defaultConfig);
  const [originalConfig, setOriginalConfig] = useState<CalculatorConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load calculator config from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/calculator');
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
          setOriginalConfig(data);
        } else {
          console.log('Using default config');
          setConfig(defaultConfig);
          setOriginalConfig(defaultConfig);
        }
      } catch (error) {
        console.error('Error loading calculator config:', error);
        setConfig(defaultConfig);
        setOriginalConfig(defaultConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save calculator config');
      }

      const savedData = await res.json();
      setConfig(savedData);
      setOriginalConfig(savedData);
      setSaveSuccess(true);

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save error:', error);
      alert('Хадгалахад алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(originalConfig);
  };

  if (loading) {
    return (
      <AdminLayout title="Тооцоолуур">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-slate-600">Ачаалж байна...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Тооцоолуур">
      <div className="min-h-screen bg-slate-50 relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-linear-to-br from-slate-200/40 via-slate-200/20 to-slate-100/10 rounded-full blur-[100px]" style={{ animationDuration: "8s" }} />
          <div className="absolute top-1/4 -left-40 w-[400px] h-[400px] bg-linear-to-br from-slate-200/30 via-slate-200/15 to-slate-100/5 rounded-full blur-[80px]" style={{ animationDuration: "10s" }} />
        </div>

        <div className="relative px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 
                  style={{
                    fontSize: `${config.labelFontSize * 2.5}px`,
                    color: config.labelColor,
                  }}
                  className="font-semibold mb-2"
                  suppressHydrationWarning
                >
                  Зээлийн тооцоолуур
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <SaveResetButtons 
                  onSave={handleSave}
                  onReset={handleReset}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Calculator */}
            <div className="lg:col-span-2">
              <LoanCalculator 
                defaultAmount={config.defaultAmount}
                defaultRate={config.defaultRate}
                defaultTerm={config.defaultTerm}
                maxAmount={config.maxAmount}
                maxTerm={config.maxTerm}
                minRate={config.minRate}
                maxRate={config.maxRate}
                labelColor={config.labelColor}
                labelFontSize={`${config.labelFontSize}px`}
                inputTextColor={config.inputTextColor}
                inputFontSize={`${config.inputFontSize}px`}
                inputBgColor={config.inputBgColor}
                inputBorderColor={config.inputBorderColor}
              />
            </div>

            {/* Settings Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                  Анхны утгууд
                </h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Зээлийн дүн
                  </label>
                  <input 
                    type="number" 
                    value={config.defaultAmount}
                    onChange={(e) => setConfig({ ...config, defaultAmount: e.target.value })}
                    placeholder="10000000"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Сарын хүү (%)
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={config.defaultRate}
                    onChange={(e) => setConfig({ ...config, defaultRate: e.target.value })}
                    placeholder="2.5"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Хугацаа (сар)
                  </label>
                  <input 
                    type="number" 
                    value={config.defaultTerm}
                    onChange={(e) => setConfig({ ...config, defaultTerm: e.target.value })}
                    placeholder="12"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-slate-400"
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Хязгаарууд
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Хамгийн их дүн
                      </label>
                      <input 
                        type="number" 
                        value={config.maxAmount}
                        onChange={(e) => setConfig({ ...config, maxAmount: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Хамгийн их хугацаа
                      </label>
                      <input 
                        type="number" 
                        value={config.maxTerm}
                        onChange={(e) => setConfig({ ...config, maxTerm: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Хамгийн бага хүү
                      </label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={config.minRate}
                        onChange={(e) => setConfig({ ...config, minRate: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Хамгийн их хүү
                      </label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={config.maxRate}
                        onChange={(e) => setConfig({ ...config, maxRate: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Өнгө & Хэмжээ
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Шошго өнгө
                      </label>
                      <input 
                        type="color" 
                        value={config.labelColor}
                        onChange={(e) => setConfig({ ...config, labelColor: e.target.value })}
                        className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Шошго хэмжээ (px)
                      </label>
                      <input 
                        type="number" 
                        value={config.labelFontSize}
                        onChange={(e) => setConfig({ ...config, labelFontSize: parseInt(e.target.value) || 14 })}
                        min="8"
                        max="32"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Оруулгын текст өнгө
                      </label>
                      <input 
                        type="color" 
                        value={config.inputTextColor}
                        onChange={(e) => setConfig({ ...config, inputTextColor: e.target.value })}
                        className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Оруулгын хэмжээ (px)
                      </label>
                      <input 
                        type="number" 
                        value={config.inputFontSize}
                        onChange={(e) => setConfig({ ...config, inputFontSize: parseInt(e.target.value) || 16 })}
                        min="12"
                        max="28"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Оруулгын арын өнгө
                      </label>
                      <input 
                        type="color" 
                        value={config.inputBgColor}
                        onChange={(e) => setConfig({ ...config, inputBgColor: e.target.value })}
                        className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Оруулгын сран өнгө
                      </label>
                      <input 
                        type="color" 
                        value={config.inputBorderColor}
                        onChange={(e) => setConfig({ ...config, inputBorderColor: e.target.value })}
                        className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                {saveSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                    <p className="font-medium">✓ Амжилттай хадгаллаа</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
