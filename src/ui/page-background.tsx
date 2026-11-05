import { BackgroundPattern } from '@/ui/background-pattern';
import { VignetteOverlay } from '@/ui/vignette-overlay';

export function PageBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-1">
      <BackgroundPattern />
      <VignetteOverlay />
    </div>
  );
}

export function PageBackground2() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-1">
      <BackgroundPattern />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
              radial-gradient(
                ellipse 95% 85% at 50% 50%,
                color-mix(in oklch, var(--foreground) 2%, transparent) 3%,
                color-mix(in oklch, var(--foreground) 2%, transparent) 3%,
                transparent 58%
              )
            `,
        }}
      />
    </div>
  );
}
