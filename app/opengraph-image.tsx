import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Sahara Mart - Belanja Cermat, Hemat Setiap Hari'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom, #E60000, #B00000)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20 }}>🛒</div>
        <div style={{ fontSize: 80, marginBottom: 20 }}>Sahara Mart</div>
        <div style={{ fontSize: 40, fontWeight: 'normal', textAlign: 'center' }}>
          Belanja Cermat, Hemat Setiap Hari
        </div>
        <div style={{ fontSize: 30, fontWeight: 'normal', marginTop: 30, opacity: 0.9 }}>
          Minimarket Online Terpercaya
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}