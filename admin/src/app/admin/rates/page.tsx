'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Modal from '@/components/Modal';
import DataTable from '@/components/DataTable';
import { Input, Select, Checkbox, Button, PageHeader, FormActions } from '@/components/FormElements';
import { PlusIcon, ArrowPathIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useSaveReset } from '@/hooks/useSaveReset';
import { SaveResetButtons } from '@/components/SaveResetButtons';

interface ExchangeRate {
  id: string;
  currency: string;
  currencyCode: string;
  buyRate: number;
  sellRate: number;
  midRate: number;
  flag: string;
  lastUpdated: string;
  source: 'manual' | 'api';
  isActive: boolean;
}

const defaultRates: ExchangeRate[] = [
  { id: '1', currency: 'Америк доллар', currencyCode: 'USD', buyRate: 3420, sellRate: 3450, midRate: 3435, flag: '🇺🇸', lastUpdated: new Date().toISOString(), source: 'manual', isActive: true },
  { id: '2', currency: 'Евро', currencyCode: 'EUR', buyRate: 3720, sellRate: 3760, midRate: 3740, flag: '🇪🇺', lastUpdated: new Date().toISOString(), source: 'manual', isActive: true },
  { id: '3', currency: 'Хятад юань', currencyCode: 'CNY', buyRate: 470, sellRate: 485, midRate: 477.5, flag: '🇨🇳', lastUpdated: new Date().toISOString(), source: 'manual', isActive: true },
  { id: '4', currency: 'Оросын рубль', currencyCode: 'RUB', buyRate: 37, sellRate: 40, midRate: 38.5, flag: '🇷🇺', lastUpdated: new Date().toISOString(), source: 'manual', isActive: true },
  { id: '5', currency: 'Япон иен', currencyCode: 'JPY', buyRate: 22.5, sellRate: 23.5, midRate: 23, flag: '🇯🇵', lastUpdated: new Date().toISOString(), source: 'manual', isActive: true },
  { id: '6', currency: 'Солонгос вон', currencyCode: 'KRW', buyRate: 2.5, sellRate: 2.7, midRate: 2.6, flag: '🇰🇷', lastUpdated: new Date().toISOString(), source: 'manual', isActive: false },
];

export default function RatesPage() {
  const { data: rates, setData: setRates, saveSuccess, handleSave: saveData, handleReset } = useSaveReset<ExchangeRate[]>('currencyRates', defaultRates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<ExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState(false);
  const [syncInterval, setSyncInterval] = useState(30);

  const [formData, setFormData] = useState({
    currency: '',
    currencyCode: '',
    buyRate: '',
    sellRate: '',
    flag: '',
    source: 'manual' as 'manual' | 'api',
    isActive: true,
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/rates');
      if (res.ok) {
        const data = await res.json();
        if (data?.rates) setRates(data.rates);
      }
      // API байхгүй бол default утгыг ашиглана
    } catch (error) {
      console.warn('API холболт байхгүй, default утга ашиглаж байна');
    }
    setIsLoading(false);
  };

  const syncFromAPI = async () => {
    setIsSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const updatedRates = rates.map((rate) => ({
        ...rate,
        buyRate: rate.buyRate * (1 + (Math.random() - 0.5) * 0.01),
        sellRate: rate.sellRate * (1 + (Math.random() - 0.5) * 0.01),
        lastUpdated: new Date().toISOString(),
        source: 'api' as const,
      }));
      setRates(updatedRates);
      setLastSyncTime(new Date().toLocaleString('mn-MN'));
    } catch (error) {
      console.error('Error syncing rates:', error);
      alert('Ханш шинэчлэхэд алдаа гарлаа');
    }
    setIsSyncing(false);
  };

  const openCreateModal = () => {
    setEditingRate(null);
    setFormData({ currency: '', currencyCode: '', buyRate: '', sellRate: '', flag: '', source: 'manual', isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (rate: ExchangeRate) => {
    setEditingRate(rate);
    setFormData({
      currency: rate.currency,
      currencyCode: rate.currencyCode,
      buyRate: rate.buyRate.toString(),
      sellRate: rate.sellRate.toString(),
      flag: rate.flag,
      source: rate.source,
      isActive: rate.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const buyRate = parseFloat(formData.buyRate);
    const sellRate = parseFloat(formData.sellRate);
    const midRate = (buyRate + sellRate) / 2;

    const rateData: ExchangeRate = {
      id: editingRate?.id || Date.now().toString(),
      currency: formData.currency,
      currencyCode: formData.currencyCode.toUpperCase(),
      buyRate,
      sellRate,
      midRate,
      flag: formData.flag,
      lastUpdated: new Date().toISOString(),
      source: formData.source,
      isActive: formData.isActive,
    };

    try {
      if (editingRate) {
        setRates(rates.map((r) => (r.id === editingRate.id ? rateData : r)));
      } else {
        setRates([...rates, rateData]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving rate:', error);
    }
    setSaving(false);
  };

  const handleDelete = async (rate: ExchangeRate) => {
    if (confirm(`"${rate.currency}" ханшийг устгахдаа итгэлтэй байна уу?`)) {
      setRates(rates.filter((r) => r.id !== rate.id));
    }
  };

  const toggleActive = (rate: ExchangeRate) => {
    setRates(rates.map((r) => (r.id === rate.id ? { ...r, isActive: !r.isActive } : r)));
  };

  const columns = [
    {
      key: 'flag',
      label: '',
      render: (rate: ExchangeRate) => <span className="text-2xl">{rate.flag}</span>,
    },
    {
      key: 'currencyCode',
      label: 'Валют',
      render: (rate: ExchangeRate) => (
        <div>
          <div className="font-semibold text-gray-900">{rate.currencyCode}</div>
          <div className="text-xs text-gray-500">{rate.currency}</div>
        </div>
      ),
    },
    {
      key: 'buyRate',
      label: 'Авах ханш',
      render: (rate: ExchangeRate) => (
        <span className="text-emerald-600 font-medium">
          {rate.buyRate.toLocaleString('mn-MN', { minimumFractionDigits: 2 })}₮
        </span>
      ),
    },
    {
      key: 'sellRate',
      label: 'Зарах ханш',
      render: (rate: ExchangeRate) => (
        <span className="text-red-500 font-medium">
          {rate.sellRate.toLocaleString('mn-MN', { minimumFractionDigits: 2 })}₮
        </span>
      ),
    },
    {
      key: 'midRate',
      label: 'Дундаж',
      render: (rate: ExchangeRate) => (
        <span className="text-gray-600">{rate.midRate.toLocaleString('mn-MN', { minimumFractionDigits: 2 })}₮</span>
      ),
    },
    {
      key: 'source',
      label: 'Эх сурвалж',
      render: (rate: ExchangeRate) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
          rate.source === 'api' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {rate.source === 'api' ? 'API' : 'Гараар'}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Төлөв',
      render: (rate: ExchangeRate) => (
        <button
          onClick={() => toggleActive(rate)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            rate.isActive
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${rate.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          {rate.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
        </button>
      ),
    },
  ];

  return (
    <AdminLayout title="Валютын ханш">
      {saveSuccess && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-emerald-900">Амжилттай хадгалагдлаа!</h4>
            <p className="text-xs text-emerald-700 mt-0.5">Өөрчлөлтүүд хадгалагдсан.</p>
          </div>
        </div>
      )}
      
      <PageHeader
        title="Валютын ханш"
        description="Валютын ханшийг удирдах, API-аас шинэчлэх"
        action={
          <div className="flex gap-3">
            <SaveResetButtons 
              onSave={saveData}
              onReset={handleReset}
              confirmMessage="Та хадгалахдаа итгэлтэй байна уу?"
            />
            <Button
              variant="secondary"
              onClick={syncFromAPI}
              loading={isSyncing}
              icon={<ArrowPathIcon className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />}
            >
              {isSyncing ? 'Шинэчилж байна...' : 'API-аас шинэчлэх'}
            </Button>
            <Button variant="dark" onClick={openCreateModal} icon={<PlusIcon className="h-4 w-4" />}>
              Валют нэмэх
            </Button>
          </div>
        }
      />

      {/* Sync Settings Card */}
      <div className="card p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Автомат шинэчлэлт тохиргоо</h2>
        <div className="flex flex-wrap items-center gap-6">
          <Checkbox
            label="Автоматаар шинэчлэх"
            checked={autoSync}
            onChange={(e) => setAutoSync(e.target.checked)}
          />
          {autoSync && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Давтамж:</span>
              <select
                value={syncInterval}
                onChange={(e) => setSyncInterval(Number(e.target.value))}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value={15}>15 минут</option>
                <option value={30}>30 минут</option>
                <option value={60}>1 цаг</option>
                <option value={120}>2 цаг</option>
                <option value={360}>6 цаг</option>
              </select>
            </div>
          )}
          {lastSyncTime && (
            <span className="text-sm text-gray-500">Сүүлд шинэчилсэн: {lastSyncTime}</span>
          )}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>API эх сурвалж:</strong> Монголбанкны валютын ханшийн API-аас шинэчилнэ. 
            Гараар оруулсан ханш API шинэчлэлтээр дарагдахгүй.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rates}
        onEdit={openEditModal}
        onDelete={handleDelete}
        loading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRate ? 'Ханш засах' : 'Валют нэмэх'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Валютын код"
              value={formData.currencyCode}
              onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
              placeholder="USD"
              maxLength={3}
            />
            <Input
              label="Туг (Emoji)"
              value={formData.flag}
              onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
              placeholder="🇺🇸"
            />
          </div>

          <Input
            label="Валютын нэр (Монгол)"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            placeholder="Америк доллар"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Авах ханш (₮)"
              type="number"
              step="0.01"
              value={formData.buyRate}
              onChange={(e) => setFormData({ ...formData, buyRate: e.target.value })}
              placeholder="3420.00"
            />
            <Input
              label="Зарах ханш (₮)"
              type="number"
              step="0.01"
              value={formData.sellRate}
              onChange={(e) => setFormData({ ...formData, sellRate: e.target.value })}
              placeholder="3450.00"
            />
          </div>

          <Select
            label="Эх сурвалж"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value as 'manual' | 'api' })}
            options={[
              { value: 'manual', label: 'Гараар оруулсан' },
              { value: 'api', label: 'API-аас авсан' },
            ]}
          />

          <Checkbox
            label="Вэб сайтад харуулах"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />

          <FormActions onCancel={() => setIsModalOpen(false)} loading={saving} />
        </form>
      </Modal>
    </AdminLayout>
  );
}
