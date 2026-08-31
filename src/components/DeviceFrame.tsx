import { useEffect, useRef, type ReactNode } from 'react';
import type { Preset, NotchConfig, StatusBarConfig } from '../types';
import { StatusBar } from './StatusBar';
import { NotchOverlay } from './NotchOverlay';

interface DeviceFrameProps {
  preset: Preset;
  notch: NotchConfig;
  statusBar: StatusBarConfig;
  iframeSrc: string | null;
  iframeKey: number;
  onIframeRef: (el: HTMLIFrameElement | null) => void;
  onLoad: () => void;
  children?: ReactNode;
}

export function DeviceFrame({
  preset,
  notch,
  statusBar,
  iframeSrc,
  iframeKey,
  onIframeRef,
  onLoad,
  children,
}: DeviceFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scale device to fit available space
  useEffect(() => {
    const fit = () => {
      const el = containerRef.current;
      if (!el) return;
      const parent = el.parentElement;
      if (!parent) return;
      const availW = parent.clientWidth - 80;
      const availH = parent.clientHeight - 80;
      const scale = Math.min(
        availW / (preset.deviceWidth + preset.bezelWidth * 2),
        availH / (preset.deviceHeight + preset.bezelWidth * 2),
        1,
      );
      el.style.transform = `scale(${scale})`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (containerRef.current?.parentElement) {
      ro.observe(containerRef.current.parentElement);
    }
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [preset]);

  const outerW = preset.deviceWidth + preset.bezelWidth * 2;
  const outerH = preset.deviceHeight + preset.bezelWidth * 2;

  return (
    <div
      ref={containerRef}
      className="device-frame relative"
      style={{
        width: outerW,
        height: outerH,
        borderRadius: preset.cornerRadius + preset.bezelWidth,
        padding: preset.bezelWidth,
        transformOrigin: 'center center',
      }}
    >
      {/* Screen */}
      <div
        className="relative overflow-hidden bg-white"
        style={{
          width: preset.deviceWidth,
          height: preset.deviceHeight,
          borderRadius: preset.cornerRadius - preset.screenInset,
        }}
      >
        {/* Status bar */}
        <StatusBar config={statusBar} />

        {/* Notch overlay */}
        <NotchOverlay config={notch} deviceWidth={preset.deviceWidth} />

        {/* Iframe viewport */}
        <iframe
          key={iframeKey}
          ref={onIframeRef}
          src={iframeSrc ?? undefined}
          onLoad={onLoad}
          title="device-viewport"
          className="absolute left-0 top-0 border-0 bg-white"
          style={{
            width: preset.deviceWidth,
            height: preset.deviceHeight,
            paddingTop: '44px',
            pointerEvents: 'auto',
          }}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />

        {/* Home indicator */}
        <div
          className="absolute bottom-1.5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/30"
          style={{ width: 120, height: 4 }}
        />

        {children}
      </div>
    </div>
  );
}
