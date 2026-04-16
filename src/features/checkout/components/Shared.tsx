import React from 'react';
import { Label } from '@/components/ui/label';

export const FormItem = ({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) => (
  <div className="grid w-full items-center gap-2">
    <Label htmlFor={id} className="text-gray-700 font-medium">
      {label}
    </Label>
    {children}
  </div>
);
