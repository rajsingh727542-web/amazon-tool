interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)]">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-[10.5px] leading-relaxed text-[var(--text-faint)]">
          {hint}
        </p>
      )}
    </div>
  );
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}: SliderRowProps) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)]">
          {label}
        </span>
        <span className="mono text-[11px] text-[var(--text)]">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)]">
        {label}
      </label>
      <div
        className="flex gap-1 rounded-lg p-1"
        style={{ background: 'var(--surface)' }}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex-1 rounded-md px-2 py-1.5 text-[11.5px] font-medium transition-all"
            style={{
              background:
                value === opt.value ? 'var(--accent)' : 'transparent',
              color: value === opt.value ? '#fff' : 'var(--text-dim)',
              boxShadow:
                value === opt.value ? '0 2px 8px var(--accent-glow)' : 'none',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export function ToggleRow({ label, value, onChange }: ToggleRowProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)]">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className="relative h-5 w-9 rounded-full transition-colors"
        style={{ background: value ? 'var(--accent)' : 'var(--surface-4)' }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform"
          style={{ transform: value ? 'translateX(18px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  onClick: () => void;
  disabled?: boolean;
  full?: boolean;
}

export function ActionButton({
  label,
  icon,
  variant = 'primary',
  onClick,
  disabled = false,
  full = true,
}: ActionButtonProps) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent)',
      color: '#fff',
      boxShadow: '0 2px 12px var(--accent-glow)',
    },
    ghost: {
      background: 'var(--surface-3)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'rgba(248,113,113,0.12)',
      color: 'var(--error)',
      border: '1px solid rgba(248,113,113,0.3)',
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${
        full ? 'w-full' : ''
      } flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-[12.5px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40`}
      style={{
        ...styles[variant],
        ...(disabled ? { boxShadow: 'none' } : {}),
      }}
    >
      {icon}
      {label}
    </button>
  );
}
