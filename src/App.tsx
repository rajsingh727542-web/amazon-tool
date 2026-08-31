import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Settings2, Smartphone } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { DeviceFrame } from './components/DeviceFrame';
import { TransitionOverlay } from './components/TransitionOverlay';
import { PRESETS } from './presets';
import type {
  NotchConfig,
  StatusBarConfig,
  MutatorRow,
  CalendarConfig,
  AssetConfig,
  Preset,
} from './types';
import { mutateTextNodes, computeCalendarString } from './lib/utils';
import { DEMO_HTML } from './lib/demoHtml';
import { TEMPLATES } from './lib/templates';

export default function App() {
  // --- Sidebar visibility ---
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- File / iframe state ---
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [isDemo, setIsDemo] = useState(true);

  // --- Template state ---
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // --- Preset ---
  const [preset, setPreset] = useState<Preset>(PRESETS[1]);

  // --- Mutator ---
  const [mutatorRows, setMutatorRows] = useState<MutatorRow[]>([]);
  const [mutationResult, setMutationResult] = useState<string | null>(null);

  // --- Asset ---
  const [asset, setAsset] = useState<AssetConfig>({
    imageUrl: '',
    selector: '',
    applyMode: 'all',
  });

  // --- Notch ---
  const [notch, setNotch] = useState<NotchConfig>({
    shape: 'notch',
    align: 'center',
    width: 120,
    height: 28,
    padTop: 0,
    enabled: true,
  });

  // --- Status bar ---
  const [statusBar, setStatusBar] = useState<StatusBarConfig>({
    carrier: '5G',
    wifi: 'Wi-Fi',
    battery: 78,
    showClock: true,
    clockFormat: '24h',
  });

  // --- Calendar ---
  const [calendar, setCalendar] = useState<CalendarConfig>({
    offset: 0,
    format: 'WD, MMMM DD YYYY (OFFSET)',
    selector: '.date-output',
  });

  // --- Transition ---
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [transitionDuration, setTransitionDuration] = useState(800);
  const [transitionVisible, setTransitionVisible] = useState(false);

  // Load the demo layout on first mount
  useEffect(() => {
    const blob = new Blob([DEMO_HTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    objectUrlRef.current = url;
    setIframeSrc(url);
    setLoadedFileName('demo-layout.html');
    setIsDemo(true);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, []);

  // Ctrl+M toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setSidebarOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Clean up object URLs when replaced
  const setObjectUrl = useCallback((url: string, name: string) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    objectUrlRef.current = url;
    setIframeSrc(url);
    setLoadedFileName(name);
    setIsDemo(false);
    setIframeKey((k) => k + 1);
  }, []);

  const handleFileLoad = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      setObjectUrl(url, file.name);
      setMutationResult(null);
    },
    [setObjectUrl],
  );

  const handleClearFile = useCallback(() => {
    // revert to demo
    const blob = new Blob([DEMO_HTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setObjectUrl(url, 'demo-layout.html');
    setIsDemo(true);
    setMutationResult(null);
  }, [setObjectUrl]);

  // ---- Transition trigger ----
  const runTransition = useCallback(() => {
    if (!transitionEnabled) return;
    setTransitionVisible(true);
    window.setTimeout(() => setTransitionVisible(false), transitionDuration);
  }, [transitionEnabled, transitionDuration]);

  const handleApplyTemplate = useCallback(() => {
    const id = selectedTemplateId;
    if (!id) return;
    const tmpl = TEMPLATES.find((t) => t.id === id);
    if (!tmpl) return;
    const blob = new Blob([tmpl.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setObjectUrl(url, `template:${tmpl.name}`);
    setMutationResult(null);
    runTransition();
  }, [selectedTemplateId, setObjectUrl, runTransition]);

  // ---- Iframe access helper ----
  const getIframeDoc = useCallback((): Document | null => {
    const iframe = iframeRef.current;
    if (!iframe) return null;
    try {
      return iframe.contentDocument || iframe.contentWindow?.document || null;
    } catch {
      return null;
    }
  }, []);

  const handleIframeLoad = useCallback(() => {
    // hook for future use; transitions handled by callers
  }, []);

  // ---- Apply text mutations ----
  const handleApplyMutations = useCallback(() => {
    const doc = getIframeDoc();
    if (!doc || !doc.body) {
      setMutationResult('No iframe document available.');
      return;
    }
    let total = 0;
    let applied = 0;
    for (const row of mutatorRows) {
      if (!row.find) continue;
      const n = mutateTextNodes(doc, doc.body, row.find, row.replace);
      if (n > 0) applied += 1;
      total += n;
    }
    setMutationResult(
      `${applied} rule(s) applied · ${total} text node(s) updated.`,
    );
    runTransition();
  }, [mutatorRows, getIframeDoc, runTransition]);

  // ---- Apply asset overwrite ----
  const handleApplyAsset = useCallback(() => {
    const doc = getIframeDoc();
    if (!doc || !doc.body) return;
    let imgs: HTMLImageElement[] = [];
    if (asset.applyMode === 'specific' && asset.selector.trim()) {
      try {
        imgs = Array.from(doc.querySelectorAll(asset.selector.trim()));
      } catch {
        imgs = [];
      }
    } else {
      imgs = Array.from(doc.querySelectorAll('img'));
    }
    // Also cover background-image placeholders (divs with class "placeholder")
    const placeholders = Array.from(
      doc.querySelectorAll('.placeholder, [data-placeholder]'),
    );
    let count = 0;
    for (const img of imgs) {
      img.src = asset.imageUrl;
      count += 1;
    }
    for (const el of placeholders) {
      (el as HTMLElement).style.backgroundImage = `url("${asset.imageUrl}")`;
      (el as HTMLElement).style.backgroundSize = 'cover';
      (el as HTMLElement).style.backgroundPosition = 'center';
      count += 1;
    }
    setMutationResult(`Replaced ${count} asset node(s).`);
    runTransition();
  }, [asset, getIframeDoc, runTransition]);

  // ---- Apply calendar injection ----
  const calendarPreview = useMemo(
    () => computeCalendarString(calendar.offset, calendar.format),
    [calendar.offset, calendar.format],
  );

  const handleApplyCalendar = useCallback(() => {
    const doc = getIframeDoc();
    if (!doc || !doc.body) return;
    const str = computeCalendarString(calendar.offset, calendar.format);
    let targets: Element[] = [];
    if (calendar.selector.trim()) {
      try {
        targets = Array.from(doc.querySelectorAll(calendar.selector.trim()));
      } catch {
        targets = [];
      }
    }
    if (targets.length === 0) {
      setMutationResult('No matching element for calendar selector.');
      return;
    }
    for (const el of targets) {
      el.textContent = str;
    }
    setMutationResult(`Injected date into ${targets.length} node(s).`);
    runTransition();
  }, [calendar, getIframeDoc, runTransition]);

  // ---- Fullscreen ----
  const handleFullscreen = useCallback(() => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {
        el.requestFullscreen?.();
      });
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const handleReloadIframe = useCallback(() => {
    setIframeKey((k) => k + 1);
    runTransition();
  }, [runTransition]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--surface)]">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="animate-slide-in-left h-full shrink-0">
          <Sidebar
            onFileLoad={handleFileLoad}
            loadedFileName={loadedFileName}
            onClearFile={handleClearFile}
            selectedTemplateId={selectedTemplateId}
            onTemplateSelect={setSelectedTemplateId}
            onApplyTemplate={handleApplyTemplate}
            preset={preset}
            onPresetChange={setPreset}
            mutatorRows={mutatorRows}
            onMutatorChange={setMutatorRows}
            onApplyMutations={handleApplyMutations}
            onReloadIframe={handleReloadIframe}
            mutationResult={mutationResult}
            asset={asset}
            onAssetChange={setAsset}
            onApplyAsset={handleApplyAsset}
            notch={notch}
            onNotchChange={setNotch}
            statusBar={statusBar}
            onStatusBarChange={setStatusBar}
            calendar={calendar}
            onCalendarChange={setCalendar}
            onApplyCalendar={handleApplyCalendar}
            calendarPreview={calendarPreview}
            onFullscreen={handleFullscreen}
            transitionDuration={transitionDuration}
            onTransitionDurationChange={setTransitionDuration}
            transitionEnabled={transitionEnabled}
            onTransitionEnabledChange={setTransitionEnabled}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Workspace */}
      <div className="relative flex flex-1 flex-col">
        {/* Top toolbar */}
        <div
          className="flex items-center gap-3 border-b px-4 py-2.5"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--surface-2)',
          }}
        >
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-dim)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
              title="Show panel (Ctrl+M)"
            >
              <Settings2 size={15} />
              <span>Console</span>
            </button>
          )}
          <div className="flex items-center gap-2 text-[12px] text-[var(--text-dim)]">
            <Smartphone size={14} className="text-[var(--accent)]" />
            <span className="font-semibold text-[var(--text)]">{preset.name}</span>
            <span className="text-[var(--text-faint)]">·</span>
            <span className="mono">
              {preset.deviceWidth} × {preset.deviceHeight}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-[var(--text-dim)]">
              <span
                className="live-dot h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--live)' }}
              />
              {isDemo ? 'Demo layout' : loadedFileName || 'No file'}
            </span>
            <kbd
              className="mono rounded border px-1.5 py-0.5 text-[10px]"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-faint)',
              }}
            >
              Ctrl+M
            </kbd>
          </div>
        </div>

        {/* Canvas */}
        <div className="grid-backdrop relative flex flex-1 items-center justify-center overflow-hidden p-10">
          <DeviceFrame
            preset={preset}
            notch={notch}
            statusBar={statusBar}
            iframeSrc={iframeSrc}
            iframeKey={iframeKey}
            onIframeRef={(el) => {
              iframeRef.current = el;
            }}
            onLoad={handleIframeLoad}
          >
            <TransitionOverlay
              visible={transitionVisible}
              duration={transitionDuration}
            />
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}
