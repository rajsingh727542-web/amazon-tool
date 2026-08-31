import { useState, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface CollapsibleProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  children: ReactNode;
}

export function Collapsible({
  title,
  icon,
  defaultOpen = false,
  badge,
  children,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b" style={{ borderColor: 'var(--border-soft)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
      >
        {icon && <span className="text-[var(--accent)]">{icon}</span>}
        <span className="flex-1 text-[12.5px] font-semibold tracking-wide text-[var(--text)]">
          {title}
        </span>
        {badge && (
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            {badge}
          </span>
        )}
        <ChevronRight
          size={15}
          className="text-[var(--text-faint)] transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div className="animate-fade-in px-4 pb-4 pt-1">{children}</div>
      )}
    </div>
  );
}
