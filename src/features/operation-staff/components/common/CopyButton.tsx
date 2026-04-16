import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, size = 'sm', className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 hover:text-slate-800 ${className}`}
      title={copied ? 'Đã sao chép!' : 'Sao chép'}
    >
      {copied ? (
        <Check className={`${sizeClasses[size]} text-green-600`} />
      ) : (
        <Copy className={sizeClasses[size]} />
      )}
    </button>
  );
};

export default CopyButton;
