export interface EyeSpecs {
  sphere: string;
  cylinder: string;
  axis: string;
  add: string;
  pd: string;
}

export interface PrescriptionData {
  imageUrl: string | null;
  od: EyeSpecs;
  os: EyeSpecs;
  notes: string;
}

// Giá trị mặc định rỗng (helper)
export const INITIAL_EYE_SPECS: EyeSpecs = {
  sphere: '',
  cylinder: '',
  axis: '',
  add: '',
  pd: '',
};
