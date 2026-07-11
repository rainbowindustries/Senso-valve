import './globals.css'

export const metadata = {
  title: 'Vertex Valve ',
  description: 'Industrial Valve Manufacturer',
  icon: '/Vertex_Valve_logo.jpeg', // Replace with your logo URL
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