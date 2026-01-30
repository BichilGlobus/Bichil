'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useSaveReset } from '@/hooks/useSaveReset'
import { SaveResetButtons } from '@/components/SaveResetButtons'

interface Branch {
  id: string
  branch_name: string
  address: string
  work_days: string | null
  work_hours: string | null
  latitude: string | null
  longitude: string | null
  phone_numbers: string[] | null
  province_name: string | null
  district_name: string | null
  region_name: string | null
  image?: string
}

const initialFormData = {
  branch_name: '',
  address: '',
  work_days: 'Даваа-Баасан',
  work_hours: '09:00 - 18:00',
  latitude: '47.9184',
  longitude: '106.9177',
  phone_numbers: [''],
  province_name: '',
  district_name: '',
  region_name: 'ulaanbaatar',
  image: '',
}

export default function BranchesPage() {
  const { data: branches, setData: setBranches, saveSuccess, handleSave: saveData, handleReset } = useSaveReset<Branch[]>('branches', []);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/admin/branches')
      if (res.ok) {
        const text = await res.text()
        if (text) {
          const data = JSON.parse(text)
          if (data.items) setBranches(data.items)
        }
      }
    } catch (error) {
      console.warn('API холболт байхгүй, default утга ашиглаж байна')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingBranch ? '/api/admin/branches?id=' + editingBranch.id : '/api/admin/branches'
      const res = await fetch(url, {
        method: editingBranch ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${res.status}`)
      }

      await fetchBranches()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving branch:', error)
      const message = error instanceof Error ? error.message : 'Хадгалахад алдаа гарлаа'
      alert(`Алдаа: ${message}`)
    }
  }

  const handleDelete = async (branch: Branch) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return
    try {
      const res = await fetch('/api/admin/branches?id=' + branch.id, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchBranches()
    } catch (error) {
      console.error('Error deleting branch:', error)
      alert('Устгахад алдаа гарлаа')
    }
  }

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setFormData({
      branch_name: branch.branch_name,
      address: branch.address,
      work_days: branch.work_days || 'Даваа-Баасан',
      work_hours: branch.work_hours || '09:00 - 18:00',
      latitude: branch.latitude || '47.9184',
      longitude: branch.longitude || '106.9177',
      phone_numbers: branch.phone_numbers || [''],
      province_name: branch.province_name || '',
      district_name: branch.district_name || '',
      region_name: branch.region_name || 'ulaanbaatar',
      image: branch.image || '',
    })
    setImagePreview(branch.image || '')
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingBranch(null)
    setFormData(initialFormData)
    setImagePreview('')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFormData({ ...formData, image: base64String })
      setImagePreview(base64String)
    }
    reader.readAsDataURL(file)
  }

  const columns = [
    { key: 'branch_name', label: 'Нэр' },
    { key: 'address', label: 'Хаяг' },
    { 
      key: 'phone_numbers', 
      label: 'Утас',
      render: (branch: Branch) => (
        <span>{branch.phone_numbers && branch.phone_numbers.length > 0 ? branch.phone_numbers[0] : '-'}</span>
      )
    },
    { 
      key: 'location', 
      label: 'Байршил',
      render: (branch: Branch) => (
        <div className="text-xs">
          <div className="text-gray-900 font-medium">{branch.district_name || '-'}</div>
          <div className="text-gray-500">{branch.province_name || '-'}</div>
        </div>
      )
    },
    { key: 'work_hours', label: 'Цаг' },
  ]

  return (
    <AdminLayout title="Салбарууд">
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
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Салбарууд</h2>
        <div className="flex items-center gap-3">
          <SaveResetButtons 
            onSave={saveData}
            onReset={handleReset}
            confirmMessage="Та хадгалахдаа итгэлтэй байна уу?"
          />
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 shadow-sm transition-all">
            <PlusIcon className="h-5 w-5" />
            Шинэ салбар
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={branches} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingBranch ? 'Салбар засварлах' : 'Шинэ салбар'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Салбарын нэр</label>
            <input 
              type="text" 
              value={formData.branch_name} 
              onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })} 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Хаяг</label>
            <textarea 
              value={formData.address} 
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
              rows={2} 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Зураг</label>
            <div className="space-y-2">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              <p className="text-xs text-gray-500">Эсвэл URL оруулна уу:</p>
              <input 
                type="text" 
                value={formData.image || ''} 
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value })
                  setImagePreview(e.target.value)
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="/images/news1.jpg"
              />
            </div>
            {(formData.image || imagePreview) && (
              <div className="mt-2">
                <img src={formData.image || imagePreview} alt="Салбарын зураг" className="w-full h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Бүс нутаг</label>
              <select
                value={formData.region_name || ''}
                onChange={(e) => setFormData({ ...formData, region_name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="ulaanbaatar">Улаанбаатар</option>
                <option value="aimag">Орон нутаг</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Аймаг/Хот</label>
              <input 
                type="text" 
                value={formData.province_name || ''} 
                onChange={(e) => setFormData({ ...formData, province_name: e.target.value })} 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Улаанбаатар"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дүүрэг/Сум</label>
              <input 
                type="text" 
                value={formData.district_name || ''} 
                onChange={(e) => setFormData({ ...formData, district_name: e.target.value })} 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Баянгол"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ажлын өдрүүд</label>
              <input 
                type="text" 
                value={formData.work_days || ''} 
                onChange={(e) => setFormData({ ...formData, work_days: e.target.value })} 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Даваа-Баасан"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ажлын цаг</label>
              <input 
                type="text" 
                value={formData.work_hours || ''} 
                onChange={(e) => setFormData({ ...formData, work_hours: e.target.value })} 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="09:00 - 18:00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Өргөрөг (Latitude)</label>
              <input 
                type="text" 
                value={formData.latitude || ''} 
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="47.9184"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Уртраг (Longitude)</label>
              <input 
                type="text" 
                value={formData.longitude || ''} 
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="106.9177"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Утасны дугаарууд</label>
            <div className="space-y-2">
              {formData.phone_numbers?.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => {
                      const newPhones = [...(formData.phone_numbers || [])]
                      newPhones[index] = e.target.value
                      setFormData({ ...formData, phone_numbers: newPhones })
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="99119911"
                  />
                  {formData.phone_numbers && formData.phone_numbers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newPhones = formData.phone_numbers?.filter((_, i) => i !== index)
                        setFormData({ ...formData, phone_numbers: newPhones })
                      }}
                      className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Устгах
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ 
                    ...formData, 
                    phone_numbers: [...(formData.phone_numbers || []), ''] 
                  })
                }}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                + Утас нэмэх
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
              Цуцлах
            </button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-lg">
              Хадгалах
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  )
}
