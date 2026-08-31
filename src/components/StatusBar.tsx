import { Wifi, BatteryMedium, Signal } from 'lucide-react';
import type { StatusBarConfig } from '../types';
import { useLiveClock } from '../hooks/useLiveClock';

interface StatusBarProps {
  config: StatusBarConfig;
}

export function StatusBar({ config }: StatusBarProps) {
  const clock = useLiveClock(config.clockFormat);
  const batteryColor =
    config.battery > 50
      ? 'var(--success)'
      : config.battery > 20
        ? 'var(--warning)'
        : 'var(--error)';

  return (
    <div
      className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 text-white"
      style={{ height: '44px', paddingTop: '12px' }}
    >
      {/* Left: carrier + clock */}
      <div className="flex items-center gap-1.5 text-[13px] font-semibold">
        <span>{config.carrier || '5G'}</span>
        {config.showClock && (
          <span className="mono ml-1 text-[13px] font-semibold tabular-nums">
            {clock}
          </span>
        )}
      </div>
      {/* Right: metrics */}
      <div className="flex items-center gap-1.5">
        <Signal size={14} className="text-white" strokeWidth={2.5} />
        <span className="text-[11px] font-medium">{config.wifi || 'Wi-Fi'}</span>
        <Wifi size={13} className="text-white" strokeWidth={2.5} />
        <span
          className="mono ml-0.5 text-[12px] font-semibold tabular-nums"
          style={{ color: batteryColor }}
        >
          {config.battery}%
        </span>
        <BatteryMedium
          size={16}
          className="text-white"
          strokeWidth={2.5}
          style={{ color: batteryColor }}
        />
      </div>
    </div>
  );
}
