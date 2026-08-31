import { useRef } from 'react';
import {
  Upload,
  Type,
  Image as ImageIcon,
  Smartphone,
  Camera,
  Signal,
  Calendar,
  Maximize,
  X,
  Plus,
  Trash2,
  Wand2,
  RotateCcw,
  Layers,
  FileStack,
  Play,
} from 'lucide-react';
import { Collapsible } from './Collapsible';
import {
  Field,
  SliderRow,
  Segmented,
  ToggleRow,
  ActionButton,
} from './Controls';
import { PRESETS } from '../presets';
import { TEMPLATES } from '../lib/templates';
import type {
  NotchConfig,
  StatusBarConfig,
  MutatorRow,
  CalendarConfig,
  AssetConfig,
  Preset,
} from '../types';
import { uid } from '../lib/utils';

interface SidebarProps {
  // file loading
  onFileLoad: (file: File) => void;
  loadedFileName: string | null;
  onClearFile: () => void;

  // template loading
  selectedTemplateId: string | null;
  onTemplateSelect: (id: string) => void;
  onApplyTemplate: () => void;

  // presets
  preset: Preset;
  onPresetChange: (p: Preset) => void;

  // mutator
  mutatorRows: MutatorRow[];
  onMutatorChange: (rows: MutatorRow[]) => void;
  onApplyMutations: () => void;
  onReloadIframe: () => void;
  mutationResult: string | null;

  // asset
  asset: AssetConfig;
  onAssetChange: (a: AssetConfig) => void;
  onApplyAsset: () => void;

  // notch
  notch: NotchConfig;
  onNotchChange: (n: NotchConfig) => void;

  // status bar
  statusBar: StatusBarConfig;
  onStatusBarChange: (s: StatusBarConfig) => void;

  // calendar
  calendar: CalendarConfig;
  onCalendarChange: (c: CalendarConfig) => void;
  onApplyCalendar: () => void;
  calendarPreview: string;

  // fullscreen + transition
  onFullscreen: () => void;
  transitionDuration: number;
  onTransitionDurationChange: (v: number) => void;
  transitionEnabled: boolean;
  onTransitionEnabledChange: (v: boolean) => void;

  onClose: () => void;
}

export function Sidebar(props: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMutatorRow = () => {
    props.onMutatorChange([
      ...props.mutatorRows,
      { id: uid('mut'), find: '', replace: '' },
    ]);
  };

  const updateMutatorRow = (id: string, key: 'find' | 'replace', value: string) => {
    props.onMutatorChange(
      props.mutatorRows.map((r) => (r.id === id ? { ...r, [key]: value } : r)),
    );
  };

  const removeMutatorRow = (id: string) => {
    props.onMutatorChange(props.mutatorRows.filter((r) => r.id !== id));
  };

  return (
    <div
      className="flex h-full w-[340px] flex-col border-r"
      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 border-b px-4 py-3.5"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: 'linear-gradient(135deg, var(--accent), #7c5cff00)',
          }}
        >
          <Layers size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-bold tracking-tight text-[var(--text)]">
            Sandbox Console
          </div>
          <div className="text-[10px] text-[var(--text-faint)]">
            Device Frame · DOM Diagnostics
          </div>
        </div>
        <button
          type="button"
          onClick={props.onClose}
          className="rounded-md p-1.5 text-[var(--text-dim)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
          title="Hide panel (Ctrl+M)"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="scroll-thin flex-1 overflow-y-auto">
        {/* FILE LOADER */}
        <Collapsible
          title="Iframe Loader"
          icon={<Upload size={14} />}
          defaultOpen
          badge={props.loadedFileName ? 'Loaded' : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm,text/html"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) props.onFileLoad(f);
              e.target.value = '';
            }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f && /\.html?$/i.test(f.name)) props.onFileLoad(f);
            }}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-7 transition-colors hover:border-[var(--accent)]"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface)',
            }}
          >
            <Upload size={22} className="text-[var(--text-faint)]" />
            <span className="text-[11.5px] font-medium text-[var(--text-dim)]">
              Select or drop .html / .htm
            </span>
            <span className="text-[10px] text-[var(--text-faint)]">
              Loaded via local object URL
            </span>
          </div>
          {props.loadedFileName && (
            <div
              className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <span className="truncate flex-1 text-[11px] text-[var(--text-dim)]">
                {props.loadedFileName}
              </span>
              <button
                type="button"
                onClick={props.onClearFile}
                className="text-[var(--text-faint)] hover:text-[var(--error)]"
              >
                <X size={13} />
              </button>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <ActionButton
              label="Reload"
              variant="ghost"
              icon={<RotateCcw size={14} />}
              onClick={props.onReloadIframe}
              full
            />
          </div>
        </Collapsible>

        {/* TEMPLATE PICKER */}
        <Collapsible
          title="Page Templates"
          icon={<FileStack size={14} />}
          defaultOpen
        >
          <Field label="Built-in Amazon Page Snapshots" hint="Select a page template to load it into the device frame.">
            <select
              className="field"
              value={props.selectedTemplateId ?? ''}
              onChange={(e) => props.onTemplateSelect(e.target.value)}
            >
              <option value="">— Select a template —</option>
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
          {props.selectedTemplateId && (
            <p className="text-[10.5px] leading-relaxed text-[var(--text-faint)]">
              {TEMPLATES.find((t) => t.id === props.selectedTemplateId)?.description}
            </p>
          )}
          <ActionButton
            label="Load Template"
            icon={<Play size={14} />}
            onClick={props.onApplyTemplate}
            disabled={!props.selectedTemplateId}
          />
        </Collapsible>

        {/* HARDWARE PRESETS */}
        <Collapsible
          title="Hardware Presets"
          icon={<Smartphone size={14} />}
          defaultOpen
        >
          <Field label="Device Layout Preset">
            <select
              className="field"
              value={props.preset.id}
              onChange={(e) => {
                const p = PRESETS.find((x) => x.id === e.target.value);
                if (p) props.onPresetChange(p);
              }}
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.label}
                </option>
              ))}
            </select>
          </Field>
          <p className="text-[10.5px] leading-relaxed text-[var(--text-faint)]">
            {props.preset.description}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg px-3 py-2" style={{ background: 'var(--surface)' }}>
              <div className="text-[10px] uppercase text-[var(--text-faint)]">Width</div>
              <div className="mono text-[13px] text-[var(--text)]">{props.preset.deviceWidth}px</div>
            </div>
            <div className="rounded-lg px-3 py-2" style={{ background: 'var(--surface)' }}>
              <div className="text-[10px] uppercase text-[var(--text-faint)]">Height</div>
              <div className="mono text-[13px] text-[var(--text)]">{props.preset.deviceHeight}px</div>
            </div>
          </div>
        </Collapsible>

        {/* TEXT MUTATOR */}
        <Collapsible
          title="Global DOM Text Mutator"
          icon={<Type size={14} />}
          badge={props.mutatorRows.length ? String(props.mutatorRows.length) : undefined}
        >
          <div className="mb-3 space-y-2">
            {props.mutatorRows.length === 0 && (
              <p className="text-[10.5px] text-[var(--text-faint)]">
                No mutator rows yet. Add a find/replace pair below.
              </p>
            )}
            {props.mutatorRows.map((row) => (
              <div
                key={row.id}
                className="rounded-lg p-2.5"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)' }}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-faint)]">
                    Rule
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMutatorRow(row.id)}
                    className="text-[var(--text-faint)] hover:text-[var(--error)]"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <input
                  className="field mb-1.5"
                  placeholder="Text to find…"
                  value={row.find}
                  onChange={(e) => updateMutatorRow(row.id, 'find', e.target.value)}
                />
                <input
                  className="field"
                  placeholder="Replacement text…"
                  value={row.replace}
                  onChange={(e) => updateMutatorRow(row.id, 'replace', e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <ActionButton
              label="Add Row"
              variant="ghost"
              icon={<Plus size={14} />}
              onClick={addMutatorRow}
              full
            />
          </div>
          <div className="mt-2 flex gap-2">
            <ActionButton
              label="Apply Changes"
              icon={<Wand2 size={14} />}
              onClick={props.onApplyMutations}
              disabled={props.mutatorRows.length === 0 || !props.loadedFileName}
            />
          </div>
          {props.mutationResult && (
            <div
              className="mt-2.5 rounded-lg px-3 py-2 text-[11px]"
              style={{
                background: 'rgba(52,211,153,0.1)',
                color: 'var(--success)',
                border: '1px solid rgba(52,211,153,0.25)',
              }}
            >
              {props.mutationResult}
            </div>
          )}
          <p className="mt-2.5 text-[10px] leading-relaxed text-[var(--text-faint)]">
            Scans text nodes inside the iframe document without altering HTML tags or CSS.
          </p>
        </Collapsible>

        {/* ASSET OVERWRITER */}
        <Collapsible
          title="Asset Target Overwriter"
          icon={<ImageIcon size={14} />}
        >
          <Field label="Image URL" hint="Replaces image nodes inside the loaded layout.">
            <input
              className="field"
              placeholder="https://images.example.com/photo.jpg"
              value={props.asset.imageUrl}
              onChange={(e) =>
                props.onAssetChange({ ...props.asset, imageUrl: e.target.value })
              }
            />
          </Field>
          <Field label="Target Selector" hint="CSS selector for images to overwrite. Default: all img tags.">
            <input
              className="field mono"
              placeholder="img.placeholder  /  img.hero"
              value={props.asset.selector}
              onChange={(e) =>
                props.onAssetChange({ ...props.asset, selector: e.target.value })
              }
            />
          </Field>
          <Segmented
            label="Apply Mode"
            value={props.asset.applyMode}
            options={[
              { value: 'all', label: 'All images' },
              { value: 'specific', label: 'Selector only' },
            ]}
            onChange={(v) =>
              props.onAssetChange({ ...props.asset, applyMode: v })
            }
          />
          <ActionButton
            label="Overwrite Assets"
            icon={<ImageIcon size={14} />}
            onClick={props.onApplyAsset}
            disabled={!props.asset.imageUrl || !props.loadedFileName}
          />
        </Collapsible>

        {/* APERTURE / NOTCH */}
        <Collapsible
          title="Aperture & Notch Overlay"
          icon={<Camera size={14} />}
        >
          <ToggleRow
            label="Enable Overlay"
            value={props.notch.enabled}
            onChange={(v) => props.onNotchChange({ ...props.notch, enabled: v })}
          />
          <Segmented
            label="Shape"
            value={props.notch.shape}
            options={[
              { value: 'circle', label: 'Circle' },
              { value: 'oval', label: 'Oval' },
              { value: 'notch', label: 'Notch' },
            ]}
            onChange={(v) => props.onNotchChange({ ...props.notch, shape: v })}
          />
          <Segmented
            label="Alignment"
            value={props.notch.align}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
            ]}
            onChange={(v) => props.onNotchChange({ ...props.notch, align: v })}
          />
          <SliderRow
            label="Width"
            value={props.notch.width}
            min={20}
            max={300}
            unit="px"
            onChange={(v) => props.onNotchChange({ ...props.notch, width: v })}
          />
          <SliderRow
            label="Height"
            value={props.notch.height}
            min={6}
            max={60}
            unit="px"
            onChange={(v) => props.onNotchChange({ ...props.notch, height: v })}
          />
          <SliderRow
            label="Top Padding"
            value={props.notch.padTop}
            min={0}
            max={40}
            unit="px"
            onChange={(v) => props.onNotchChange({ ...props.notch, padTop: v })}
          />
        </Collapsible>

        {/* STATUS METRICS */}
        <Collapsible
          title="System Metric Simulators"
          icon={<Signal size={14} />}
        >
          <Field label="Carrier Text">
            <input
              className="field"
              placeholder="5G"
              value={props.statusBar.carrier}
              onChange={(e) =>
                props.onStatusBarChange({ ...props.statusBar, carrier: e.target.value })
              }
            />
          </Field>
          <Field label="Wi-Fi / Network Label">
            <input
              className="field"
              placeholder="Wi-Fi"
              value={props.statusBar.wifi}
              onChange={(e) =>
                props.onStatusBarChange({ ...props.statusBar, wifi: e.target.value })
              }
            />
          </Field>
          <SliderRow
            label="Asset Metric"
            value={props.statusBar.battery}
            min={0}
            max={100}
            unit="%"
            onChange={(v) =>
              props.onStatusBarChange({ ...props.statusBar, battery: v })
            }
          />
          <ToggleRow
            label="Show Live Clock"
            value={props.statusBar.showClock}
            onChange={(v) =>
              props.onStatusBarChange({ ...props.statusBar, showClock: v })
            }
          />
          <Segmented
            label="Clock Format"
            value={props.statusBar.clockFormat}
            options={[
              { value: '24h', label: '24-Hour' },
              { value: '12h', label: '12-Hour' },
            ]}
            onChange={(v) =>
              props.onStatusBarChange({ ...props.statusBar, clockFormat: v })
            }
          />
        </Collapsible>

        {/* CALENDAR NODE */}
        <Collapsible
          title="Calendar Computation Node"
          icon={<Calendar size={14} />}
        >
          <Field label="Day Offset" hint="Relative offset from today (e.g. +3 or -7).">
            <input
              type="number"
              className="field"
              value={props.calendar.offset}
              onChange={(e) =>
                props.onCalendarChange({
                  ...props.calendar,
                  offset: Number(e.target.value) || 0,
                })
              }
            />
          </Field>
          <Field
            label="Format String"
            hint="Tokens: YYYY YY MM DD MMDD MMMM WD OFFSET"
          >
            <input
              className="field mono"
              value={props.calendar.format}
              onChange={(e) =>
                props.onCalendarChange({ ...props.calendar, format: e.target.value })
              }
            />
          </Field>
          <Field label="Target Selector" hint="Text node inside the iframe to receive the string.">
            <input
              className="field mono"
              placeholder="#date-output  /  .calendar-label"
              value={props.calendar.selector}
              onChange={(e) =>
                props.onCalendarChange({ ...props.calendar, selector: e.target.value })
              }
            />
          </Field>
          <div
            className="mb-3 rounded-lg px-3 py-2.5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)' }}
          >
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
              Preview
            </div>
            <div className="mono mt-0.5 break-all text-[12px] text-[var(--text)]">
              {props.calendarPreview}
            </div>
          </div>
          <ActionButton
            label="Inject into Iframe"
            icon={<Calendar size={14} />}
            onClick={props.onApplyCalendar}
            disabled={!props.loadedFileName}
          />
        </Collapsible>

        {/* CANVAS / FULLSCREEN */}
        <Collapsible
          title="Canvas & Transition"
          icon={<Maximize size={14} />}
        >
          <ToggleRow
            label="Transition Overlay"
            value={props.transitionEnabled}
            onChange={props.onTransitionEnabledChange}
          />
          <SliderRow
            label="Transition Duration"
            value={props.transitionDuration}
            min={200}
            max={3000}
            step={100}
            unit="ms"
            onChange={props.onTransitionDurationChange}
          />
          <ActionButton
            label="Enter Fullscreen"
            icon={<Maximize size={14} />}
            onClick={props.onFullscreen}
          />
          <p className="mt-2.5 text-[10px] leading-relaxed text-[var(--text-faint)]">
            Collapses the host frame to maximise the sandbox viewport for undistracted
            evaluation.
          </p>
        </Collapsible>
      </div>

      {/* Footer */}
      <div
        className="border-t px-4 py-2.5"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between text-[10px] text-[var(--text-faint)]">
          <span>100% client-side · no network</span>
          <span className="mono">v1.0</span>
        </div>
      </div>
    </div>
  );
}
