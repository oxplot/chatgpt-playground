import * as gzip from 'gzip-js';

const gzipDecode = v => gzip.unzip(v);
const hexDecode = v => v.match(/.{2}/g).map(i => parseInt(i, 16));
const apDecode = v => v.match(/.{2}/g).map(i => (i.charCodeAt(0) - 97) * 16 + (i.charCodeAt(1) - 97));
const decoders = [
  v => gzipDecode(apDecode(v)),
  v => gzipDecode(hexDecode(v)),
  v => hexDecode(v),
  v => apDecode(v),
];
// hashDecode tries to decode the URI hash into an object.
export function hashDecode(v) {
  v = v.toLowerCase();
  // Ignore tag prefix.
  const colIdx = v.indexOf(':');
  if (colIdx !== -1) {
    v = v.substring(colIdx + 1);
  }
  // Try all decoders. If none works, throw an error.
  for (const decoder of decoders) {
    try {
      return JSON.parse(new TextDecoder('utf8').decode(new Uint8Array(decoder(v))));
    } catch (e) { }
  }
  throw "Invalid state encoding";
}
// Encoder only does one combination: gzip and ap encoding.
export const hashEncode = (v) => gzip.zip(new TextEncoder('utf8').encode(JSON.stringify(v))).map(i => String.fromCharCode(97 + Math.floor(i / 16)) + String.fromCharCode(97 + i % 16)).join('');