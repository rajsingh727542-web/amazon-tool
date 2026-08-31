export type NotchShape = 'circle' | 'oval' | 'notch';
export type NotchAlign = 'left' | 'center' | 'right';

export interface NotchConfig {
  shape: NotchShape;
  align: NotchAlign;
  width: number;
  height: number;
  padTop: number;
  enabled: boolean;
}

export interface Preset {
  id: string;
  name: string;
  label: string;
  deviceWidth: number;
  deviceHeight: number;
  screenInset: number;
  cornerRadius: number;
  bezelWidth: number;
  description: string;
}

export interface StatusBarConfig {
  carrier: string;
  wifi: string;
  battery: number;
  showClock: boolean;
  clockFormat: '12h' | '24h';
}

export interface MutatorRow {
  id: string;
  find: string;
  replace: string;
}

export interface CalendarConfig {
  offset: number;
  format: string;
  selector: string;
}

export interface AssetConfig {
  imageUrl: string;
  selector: string;
  applyMode: 'all' | 'specific';
}
