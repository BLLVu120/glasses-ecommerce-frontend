import React from 'react';
import type { BEPrescription } from '@/features/operation-staff/types/types';

interface PrescriptionSectionProps {
  prescription: BEPrescription;
}

const PrescriptionSection: React.FC<PrescriptionSectionProps> = ({ prescription }) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm text-slate-600 dark:text-slate-400">Thông số kỹ thuật:</h3>
      </div>

      <div className="bg-white dark:bg-[#1a2e22] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-[10%]">
                  Mắt
                </th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-[18%]">
                  SPH (Cầu)
                </th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-[18%]">
                  CYL (Loạn)
                </th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-[18%]">
                  AXIS (Trục)
                </th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-[18%]">
                  ADD
                </th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-[18%]">
                  PD (KC)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {/* Row OD (Right) */}
              <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-6 px-4">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">OD</span>
                    <span className="text-xs font-bold text-slate-400">Phải</span>
                  </div>
                </td>
                <td className="py-6 px-4">
                  <span className="font-mono text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">
                    {prescription?.odSphere >= 0 ? '+' : ''}
                    {prescription?.odSphere?.toFixed(2) || 0}
                  </span>
                </td>
                <td className="py-6 px-4">
                  <span className="font-mono text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">
                    {prescription?.odCylinder >= 0 ? '+' : ''}
                    {prescription?.odCylinder.toFixed(2) || 0}
                  </span>
                </td>
                <td className="py-6 px-4">
                  <span className="font-mono text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter text-blue-600 dark:text-blue-400">
                    {prescription?.odAxis || 0}
                  </span>
                </td>
                <td className="py-6 px-4">
                  <span className="font-mono text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter text-green-600 dark:text-green-400">
                    {prescription?.odAdd >= 0 ? '+' : ''}
                    {prescription?.odAdd?.toFixed(2) || 0}
                  </span>
                </td>
                <td className="py-6 px-4 bg-slate-50/50 dark:bg-slate-800/20">
                  <span className="font-mono text-4xl lg:text-5xl font-bold text-slate-700 dark:text-slate-300 tracking-tighter">
                    {prescription?.odPd || 0}
                  </span>
                </td>
              </tr>

              {/* Row OS (Left) */}
              <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors bg-slate-50/30 dark:bg-slate-800/10">
                <td className="py-6 px-4">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">OS</span>
                    <span className="text-xs font-bold text-slate-400">Trái</span>
                  </div>
                </td>
                <td className="py-6 px-4">
                  <span className="font-mono text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">
                    {prescription?.osSphere >= 0 ? '+' : ''}
                    {prescription?.osSphere?.toFixed(2) || 0}
                  </span>
                </td>
                <td className="py-6 px-4">
                  <span className="font-mono text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">
                    {prescription?.osCylinder >= 0 ? '+' : ''}
                    {prescription?.osCylinder?.toFixed(2) || 0}
                  </span>
                </td>
                <td className="py-6 px-4">
                  <span className="font-mono text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">
                    {prescription?.osAxis || 0}
                  </span>
                </td>
                <td className="py-6 px-4">
                  <span className="font-mono text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter text-green-600 dark:text-green-400">
                    {prescription?.osAdd >= 0 ? '+' : ''}
                    {prescription?.osAdd?.toFixed(2) || 0}
                  </span>
                </td>
                <td className="py-6 px-4 bg-slate-50/50 dark:bg-slate-800/20">
                  <span className="font-mono text-4xl lg:text-5xl font-bold text-slate-700 dark:text-slate-300 tracking-tighter">
                    {prescription?.osPd || 0}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Section */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Hình ảnh:</h3>
        </div>
        <div className="bg-white dark:bg-[#1a2e22] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4">
            {prescription?.imageUrl ? (
              <div className="relative group">
                <img
                  src={prescription.imageUrl}
                  alt="Đơn thuốc"
                  className="w-full aspect-[4/3] object-cover rounded-lg transition-transform duration-200 group-hover:scale-[1.02] cursor-pointer"
                  onClick={() => window.open(prescription.imageUrl, '_blank')}
                  onError={(e) => {
                    e.currentTarget.src = '/api/placeholder/400/300';
                    e.currentTarget.alt = 'Hình ảnh không khả dụng';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 rounded-lg pointer-events-none"></div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    Nhấn để phóng to
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                <div className="text-center">
                  <div className="text-slate-400 dark:text-slate-500 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Không có hình ảnh</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Section */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Ghi chú:</h3>
        </div>
        <div className="bg-white dark:bg-[#1a2e22] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[3rem]">
                {prescription?.note ? (
                  <span className="block">{prescription.note}</span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 italic">
                    Không có ghi chú
                  </span>
                )}
              </p>
              {prescription?.note && (
                <button
                  onClick={() => navigator.clipboard.writeText(prescription.note)}
                  className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="Sao chép ghi chú"
                >
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrescriptionSection;
