import * as gzip from 'gzip-js';

const gzipDecode = v => gzip.unzip(v);
const hexDecode = v => v.match(/.{2}/g).map(i => parseInt(i, 16));
const apDecode = v => v.match(/.{2}/g).map(i => (i.charCodeAt(0) - 97) * 16 + (i.charCodeAt(1) - 97));
const magicToDecoder = {
  "1f8b": v => gzipDecode(hexDecode(v)),
  "bpil": v => gzipDecode(apDecode(v)),
  "7b": v => hexDecode(v),
  "hl": v => apDecode(v),
};
export function hashDecode(v) {
  v = v.toLowerCase();
  // Ignore tag prefix.
  const colIdx = v.indexOf(':');
  if (colIdx !== -1) {
    v = v.substring(colIdx + 1);
  }
  for (const [magic, decoder] of Object.entries(magicToDecoder)) {
    if (v.startsWith(magic)) {
      return new TextDecoder('utf8').decode(new Uint8Array(decoder(v)));
    }
  }
  throw "Invalid state encoding";
}
// Encoder only does one combination: gzip and ap encoding.
export const hashEncode = (v) => gzip.zip(new TextEncoder('utf8').encode(v)).map(i => String.fromCharCode(97 + Math.floor(i / 16)) + String.fromCharCode(97 + i % 16)).join('');