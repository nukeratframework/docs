import { BackgroundRippleEffect } from './background-ripple-effect';

const CENTER_GLOW = [
  'radial-gradient(ellipse 900% 720% at 50% 120%,',
  'rgba(255,255,255,0.38) 0%,',
  'rgba(248,248,248,0.22) 0.4%,',
  'rgba(235,235,235,0.12) 5%,',
  'rgba(218,218,218,0.065) 9%,',
  'rgba(195,195,195,0.035) 12%,',
  'rgba(168,168,168,0.018) 15%,',
  'rgba(140,140,140,0.010) 18%,',
  'rgba(115,115,115,0.006) 21%,',
  'rgba(92,92,92,0.0035) 24%,',
  'rgba(72,72,72,0.002) 27%,',
  'rgba(55,55,55,0.0012) 30%,',
  'rgba(42,42,42,0.0007) 34%,',
  'rgba(32,32,32,0.0004) 38%,',
  'rgba(24,24,24,0.0002) 42%,',
  'transparent 48%)',
].join(' ');

/** Backup do hero background (ripple + glow). Restaurar em background-pattern.tsx se necessário. */
export const BackgroundPatternBackup = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -top-2.5 -left-px">
      <div aria-hidden className="absolute inset-0" style={{ background: CENTER_GLOW }} />

      <BackgroundRippleEffect cellSize={35} />
    </div>
  );
};
