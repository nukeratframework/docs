import { cn } from '@/ui/cn';

type VignetteOverlayProps = {
  className?: string;
};

export function VignetteOverlay({ className }: VignetteOverlayProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_90px_35px_rgba(0,0,0,0.18)] dark:shadow-[inset_0_0_100px_45px_rgba(0,0,0,0.75)]",
        className,
      )}
      style={{
        background: `
          radial-gradient(
            ellipse 95% 85% at 50% 50%,
            color-mix(in oklch, var(--foreground) 14%, transparent) 0%,
            color-mix(in oklch, var(--foreground) 5%, transparent) 18%,
            transparent 58%,
            rgba(0, 0, 0, 0.35) 82%,
            rgba(0, 0, 0, 0.7) 100%
          )
        `,
      }}
    />
  );
}
