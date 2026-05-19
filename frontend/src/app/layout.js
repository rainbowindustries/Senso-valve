import './globals.css'

export const metadata = {
  title: 'Rainbo Industries',
  description: 'Industrial Valve Manufacturer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}