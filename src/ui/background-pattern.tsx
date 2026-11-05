import { SpotlightNew } from '@/ui/spotlight-new';

export const BackgroundPattern = () => {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full">
      <SpotlightNew translateY={-280} xOffset={80} duration={9} />
    </div>
  );
};
