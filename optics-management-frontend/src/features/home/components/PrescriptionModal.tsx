import { useState, useRef } from 'react';
import { usePrescriptionStore } from '../store/usePrescriptionStore'; // Chuyển sang store này
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Keyboard, Image as ImageIcon, Camera } from 'lucide-react';
import type { EyeSpecs } from '@/types/prescription';

export default function PrescriptionWidget() {
  // Kết nối với Store chuyên biệt cho Prescription
  const { updatePrescription, prescription } = usePrescriptionStore();

  const [activeTab, setActiveTab] = useState<'image' | 'manual'>('image');
  const [activeEye, setActiveEye] = useState<'od' | 'os'>('od');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper cập nhật dữ liệu mắt (OD/OS) một cách type-safe
  const updateEyeData = (eye: 'od' | 'os', field: keyof EyeSpecs, value: string) => {
    // Tạo object mới cho mắt đó
    const newEyeData = { ...prescription[eye], [field]: value };

    // Gửi update lên store (Sử dụng Partial<PrescriptionData>)
    updatePrescription({
      [eye]: newEyeData,
    });
  };

  // Hàm chuyển đổi File người dùng upload thành Base64
  // Hàm chuyển đổi File người dùng upload thành Base64 (Đã thêm Type)
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string); // Trả về chuỗi Base64
      reader.onerror = (error) => reject(error);
    });
  };

  // Xử lý khi người dùng chọn ảnh đơn thuốc
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lấy file đầu tiên từ input
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64Image = await convertFileToBase64(file);

        // Cập nhật chuỗi Base64 vào Store đúng cách
        updatePrescription({ imageUrl: base64Image });
      } catch (error) {
        console.error('Lỗi khi đọc file ảnh:', error);
      }
    }

    // Reset lại value của input để có thể chọn lại cùng 1 file nếu lỡ xóa
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderMiniInput = (val: string, onChange: (v: string) => void) => (
    <Input
      value={val}
      onChange={(e) => onChange(e.target.value)}
      className="text-center font-bold text-gray-800 h-8 text-xs bg-white border-gray-200 focus:border-[#4A8795] rounded px-0"
      placeholder="0.00"
    />
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300">
      {/* 1. HEADER */}
      <div className="bg-gray-50/50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
          Thông tin độ cận
        </span>
        <div className="flex bg-gray-200/50 p-0.5 rounded-lg">
          <button
            onClick={() => setActiveTab('image')}
            className={`p-1.5 rounded-md transition-all ${activeTab === 'image' ? 'bg-white text-[#4A8795] shadow-sm' : 'text-gray-400'}`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`p-1.5 rounded-md transition-all ${activeTab === 'manual' ? 'bg-white text-[#4A8795] shadow-sm' : 'text-gray-400'}`}
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. BODY */}
      <div className="p-4">
        {activeTab === 'image' ? (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <div
              onClick={() => !prescription.imageUrl && fileInputRef.current?.click()}
              className={`relative rounded-lg border-2 border-dashed h-32 flex flex-col items-center justify-center cursor-pointer transition-colors
                    ${prescription.imageUrl ? 'border-gray-200 bg-white' : 'border-gray-300 bg-gray-50 hover:border-[#4A8795]'}`}
            >
              {prescription.imageUrl ? (
                <>
                  <img
                    src={prescription.imageUrl}
                    className="h-full w-full object-contain p-1 rounded"
                    alt="Prescription"
                  />
                  <div className="absolute top-1 right-1">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePrescription({ imageUrl: null });
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-1 text-center">
                  <Camera className="w-5 h-5 text-gray-400 mx-auto" />
                  <span className="text-[10px] font-semibold text-gray-500 block">
                    Tải ảnh đơn kính
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
            {/* OD/OS Switch */}
            <div className="flex justify-center mb-3">
              <div className="flex bg-gray-100 p-1 rounded-full w-full max-w-[200px]">
                <button
                  onClick={() => setActiveEye('od')}
                  className={`flex-1 text-[10px] font-bold py-1 rounded-full transition-all ${activeEye === 'od' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                >
                  OD (Mắt phải)
                </button>
                <button
                  onClick={() => setActiveEye('os')}
                  className={`flex-1 text-[10px] font-bold py-1 rounded-full transition-all ${activeEye === 'os' ? 'bg-white text-[#4A8795] shadow-sm' : 'text-gray-400'}`}
                >
                  OS (Mắt trái)
                </button>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-lg border transition-all ${activeEye === 'od' ? 'bg-gray-50 border-gray-100' : 'bg-[#4A8795]/5 border-[#4A8795]/20'}`}
            >
              <div className="grid grid-cols-5 gap-1 mb-1 text-center">
                {['SPH', 'CYL', 'AX', 'ADD', 'PD'].map((l) => (
                  <label key={l} className="text-[9px] font-bold text-gray-400">
                    {l}
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {/* Render Input dựa trên mắt đang chọn */}
                {(['sphere', 'cylinder', 'axis', 'add', 'pd'] as const).map((field) =>
                  renderMiniInput(prescription[activeEye][field], (v) =>
                    updateEyeData(activeEye, field, v),
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-3">
          <Textarea
            placeholder="Ghi chú thêm cho kỹ thuật viên..."
            value={prescription.notes}
            onChange={(e) => updatePrescription({ notes: e.target.value })}
            className="bg-white text-xs min-h-[50px] resize-none focus:border-[#4A8795]"
          />
        </div>
      </div>
    </div>
  );
}
