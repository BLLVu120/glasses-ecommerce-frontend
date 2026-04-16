import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import type { SalesNote } from '@/features/operation-staff/types/types';

interface SalesNotesSectionProps {
  notes: SalesNote[];
}

const SalesNotesSection: React.FC<SalesNotesSectionProps> = ({ notes }) => {
  const getNoteIcon = (type: SalesNote['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-6 h-6" />;
      case 'info':
        return <Info className="w-6 h-6" />;
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const getNoteStyles = (type: SalesNote['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400';
      default:
        return 'bg-slate-50 dark:bg-slate-900/20 border-l-4 border-slate-400';
    }
  };

  const getNoteColor = (type: SalesNote['type']) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-500';
      case 'info':
        return 'text-blue-600 dark:text-blue-500';
      case 'success':
        return 'text-green-600 dark:text-green-500';
      default:
        return 'text-slate-600 dark:text-slate-500';
    }
  };

  return (
    <section className="pb-24">
      {notes?.map((note) => (
        <div
          key={note.id}
          className={`${getNoteStyles(note.type)} p-6 rounded-r-xl shadow-sm flex items-start gap-4 mb-4`}
        >
          <div className="flex-shrink-0">
            <div className={getNoteColor(note.type)}>{getNoteIcon(note.type)}</div>
          </div>
          <div>
            <h4
              className={`${getNoteColor(note.type)} font-bold uppercase text-sm mb-1 tracking-wider`}
            >
              {note.title}
            </h4>
            <p className="text-slate-900 dark:text-white text-lg md:text-xl font-bold leading-snug">
              "{note.message}"
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SalesNotesSection;
