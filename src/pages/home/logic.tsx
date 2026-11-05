import { useEffect, useState } from 'react';

export const githubUrl = 'https://github.com/nukeratframework/nukerat';
export const nukeratRepoUrl = 'https://github.com/nukeratframework/nukerat';
export const qrUrl = 'https://nukerat.com';

export function useHome() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [nativePreview, setNativePreview] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setIsDark(el.classList.contains('dark')));
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  return {
    nativePreview,
    showWeb: () => setNativePreview(false),
    showNative: () => setNativePreview(true),
    qrBg: isDark ? 'black' : 'white',
    qrFg: isDark ? 'white' : 'black',
  };
}
