import { readFileSync } from 'node:fs';
import { imageSize } from '@img/size';

export function imageSizeFromFile(file) {
  return imageSize(new Uint8Array(readFileSync(file)));
}

export default imageSizeFromFile;
