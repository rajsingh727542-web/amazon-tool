import type { NotchConfig } from '../types';

interface NotchOverlayProps {
  config: NotchConfig;
  deviceWidth: number;
}

export function NotchOverlay({ config, deviceWidth }: NotchOverlayProps) {
  if (!config.enabled) return null;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    top: config.padTop,
    zIndex: 30,
    background: '#000',
    pointerEvents: 'none',
  };

  // Horizontal alignment
  let left: string | number;
  if (config.align === 'left') left = '12%';
  else if (config.align === 'right') left = 'auto';
  else left = '50%';

  const alignRight = config.align === 'right';
  const transform =
    config.align === 'center' ? 'translateX(-50%)' : 'none';

  let shapeStyle: React.CSSProperties = {};
  if (config.shape === 'circle') {
    shapeStyle = {
      width: config.height,
      height: config.height,
      borderRadius: '50%',
    };
  } else if (config.shape === 'oval') {
    shapeStyle = {
      width: config.width,
      height: config.height,
      borderRadius: '50%',
    };
  } else {
    // notch
    shapeStyle = {
      width: config.width,
      height: config.height,
      borderRadius: '0 0 18px 18px',
    };
  }

  return (
    <div
      style={{
        ...baseStyle,
        ...shapeStyle,
        left: alignRight ? 'auto' : left,
        right: alignRight ? '12%' : 'auto',
        transform,
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        maxWidth: deviceWidth - 24,
      }}
    >
      {/* camera glint */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: Math.min(config.height * 0.3, 8),
          height: Math.min(config.height * 0.3, 8),
          borderRadius: '50%',
          background: 'radial-gradient(circle, #1a2a4a 30%, #000 70%)',
          boxShadow: 'inset 0 0 4px rgba(79,140,255,0.3)',
        }}
      />
    </div>
  );
}
