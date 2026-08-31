interface TransitionOverlayProps {
  visible: boolean;
  duration: number;
}

export function TransitionOverlay({
  visible,
  duration,
}: TransitionOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4"
      style={{
        background: 'rgba(10,12,18,0.82)',
        backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.12s ease',
      }}
    >
      <div className="text-[13px] font-semibold tracking-wide text-white">
        Updating workspace
      </div>
      <div
        className="h-1 overflow-hidden rounded-full"
        style={{ width: '60%', background: 'rgba(255,255,255,0.12)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, var(--accent), #7cb0ff)',
            animation: `progressFill ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          }}
        />
      </div>
    </div>
  );
}
