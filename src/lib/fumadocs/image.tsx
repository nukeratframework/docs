import type { ImgHTMLAttributes } from 'react';

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
};

export default function Image({ src, alt, className, style, fill, ...props }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt ?? ''}
      className={className}
      style={fill ? { ...style, objectFit: 'cover', width: '100%', height: '100%' } : style}
      {...props}
    />
  );
}
