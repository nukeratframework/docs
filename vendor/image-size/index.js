import { readFileSync } from 'node:fs';
import { imageSize as readSize } from '@img/size';

function toBytes(input) {
  if (typeof input === 'string') return new Uint8Array(readFileSync(input));
  if (Buffer.isBuffer(input)) return new Uint8Array(input);
  return input;
}

export function imageSize(input) {
  return readSize(toBytes(input));
}

export default imageSize;
