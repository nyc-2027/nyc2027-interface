import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const alt = '2027 JCI Vietnam New Year Convention · 15–17.01.2027 · Wyndham Grand Vedana Ninh Bình';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const landscape = await readFile(join(process.cwd(), 'public/images/trang-an.jpg'));
  const title = await readFile(join(process.cwd(), 'public/images/Text_NYC.png'));

  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '60px', background: '#050d55', color: '#fff' }}>
      <img src={`data:image/jpeg;base64,${landscape.toString('base64')}`} width={1200} height={630} style={{ position: 'absolute', inset: 0, objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,13,85,0.15), rgba(5,13,85,0.95))' }} />
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ fontSize: 30, marginBottom: 28 }}>2027 JCI VIETNAM</div>
        <img src={`data:image/png;base64,${title.toString('base64')}`} width={1080} height={108} />
        <div style={{ fontSize: 28, color: '#9be8f5', marginTop: 36 }}>15–17.01.2027</div>
        <div style={{ fontSize: 26, marginTop: 12 }}>Wyndham Grand Vedana Ninh Bình</div>
        <div style={{ fontSize: 22, color: '#f4cf86', marginTop: 24 }}>LEADING FOR IMPACT</div>
      </div>
    </div>,
    size,
  );
}
