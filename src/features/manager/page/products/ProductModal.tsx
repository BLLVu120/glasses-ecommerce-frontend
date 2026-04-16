import { useEffect, useRef, useState } from 'react';
import { X, Loader2, Upload, Box } from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  brand: '',
  category: '',
  frameType: '',
  gender: '',
  shape: '',
  frameMaterial: '',
  hingeType: '',
  nosePadType: '',
  weightGram: 0,
  status: 'ACTIVE',
  imageUrl: [] as string[],
};

export default function ProductModal({
  open,
  onClose,
  onSubmit,
  product,
  isSubmitting = false,
}: any) {
  const [form, setForm] = useState(EMPTY_FORM);
  
  // 1. Chuyển state sang mảng để lưu nhiều ảnh
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const [selectedModelFile, setSelectedModelFile] = useState<File | null>(null);
  const [modelFileName, setModelFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (product) {
        const normalizedImageUrl = Array.isArray(product.imageUrl)
          ? product.imageUrl.map((img: any) =>
              typeof img === 'string' ? img : (img.imageUrl ?? ''),
            ).filter(Boolean) // Loại bỏ các chuỗi rỗng
          : [];
        setForm({ ...product, imageUrl: normalizedImageUrl });
        
        // Load ảnh cũ vào preview
        setImagePreviews(normalizedImageUrl);
        setSelectedFiles([]); // Reset file mới
        
        setSelectedModelFile(null);
        setModelFileName(product.modelUrl ? 'Current 3D model' : '');
      } else {
        setForm(EMPTY_FORM);
        setImagePreviews([]);
        setSelectedFiles([]);
        setSelectedModelFile(null);
        setModelFileName('');
      }
    }
  }, [open, product]);

  if (!open) return null;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2. Xử lý khi chọn nhiều file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Lưu thêm file mới vào state
    setSelectedFiles(prev => [...prev, ...files]);

    // Tạo preview cho các file mới và gộp vào mảng preview hiện tại
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // 3. Hàm xóa ảnh (tùy chọn nhưng rất cần thiết cho UX)
  const removeImage = (indexToRemove: number) => {
    // Nếu xóa ảnh mới upload
    if (indexToRemove >= (imagePreviews.length - selectedFiles.length)) {
      const fileIndex = indexToRemove - (imagePreviews.length - selectedFiles.length);
      setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedModelFile(file);
    setModelFileName(file.name);
  };

  const inputClass =
    'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 transition-all';
  const labelClass = 'block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide';  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl shadow-slate-900/20 animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {product
                ? 'Update the product information below.'
                : 'Fill in the details for the new product.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-7 py-6 flex-1">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <div className="col-span-2">
              <label className={labelClass}>Product Name *</label>
              <input
                name="name"
                placeholder="e.g. Classic Aviator Frame"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Brand *</label>
              <input
                name="brand"
                placeholder="e.g. Ray-Ban"
                value={form.brand}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select category</option>
                <option value="FRAME">Frame</option>
                <option value="LENS">Lens</option>
                <option value="CONTACT">Contact</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Frame Type</label>
              <input
                name="frameType"
                placeholder="e.g. Full-rim"
                value={form.frameType}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="UNISEX">Unisex</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Shape</label>
              <input
                name="shape"
                placeholder="e.g. Rectangular"
                value={form.shape}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Frame Material</label>
              <input
                name="frameMaterial"
                placeholder="e.g. Titanium"
                value={form.frameMaterial}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Hinge Type</label>
              <input
                name="hingeType"
                placeholder="e.g. Spring hinge"
                value={form.hingeType}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Nose Pad Type</label>
              <input
                name="nosePadType"
                placeholder="e.g. Adjustable"
                value={form.nosePadType}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Weight (gram)</label>
              <input
                type="number"
                name="weightGram"
                placeholder="e.g. 28"
                value={form.weightGram || ''}
                onChange={handleChange}
                className={inputClass}
                min={0}
              />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Images</label>
              <div className="flex flex-col gap-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-3 px-4 py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all group"
                >
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 shrink-0 transition-colors" />
                  <span className="text-sm text-slate-500 group-hover:text-indigo-600 transition-colors">
                    Click to upload multiple images
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple // Thêm thuộc tính multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Grid hiển thị nhiều ảnh */}
                {imagePreviews.length > 0 && (
                  <div className="flex gap-3 flex-wrap mt-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 group">
                        <img
                          src={preview}
                          alt={`preview-${index}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {/* Nút xóa ảnh */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <label className={labelClass}>3D Model (.glb)</label>
              <div className="flex gap-3 items-center">
                <div
                  onClick={() => modelFileInputRef.current?.click()}
                  className="flex-1 flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:border-violet-400 hover:bg-violet-50/30 cursor-pointer transition-all group"
                >
                  <Upload className="w-4 h-4 text-slate-400 group-hover:text-violet-500 shrink-0 transition-colors" />
                  <span className="text-sm text-slate-400 group-hover:text-violet-500 transition-colors truncate">
                    {modelFileName || 'Click to upload 3D model (.glb)'}
                  </span>
                  <input
                    ref={modelFileInputRef}
                    type="file"
                    accept=".glb,.gltf"
                    className="hidden"
                    onChange={handleModelFileChange}
                  />
                </div>

                <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                  <Box className={`w-5 h-5 ${modelFileName ? 'text-violet-500' : 'text-slate-300'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            // 3. Truyền cả form data và file ra ngoài cho onSubmit handler
            onClick={() => onSubmit({ productData: form, files: selectedFiles, modelFile: selectedModelFile })}
            disabled={isSubmitting || !form.name || !form.brand}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {product ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
