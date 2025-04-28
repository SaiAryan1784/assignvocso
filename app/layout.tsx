// app/layout.tsx

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Real Estate Project Listings',
  description: 'Browse real estate projects across different cities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">MagicBricks Project Finder</h1>
          </div>
        </header>
        {children}
        <footer className="bg-gray-100 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-600">
            <p>© {new Date().getFullYear()} Real Estate Project Listings</p>
          </div>
        </footer>
      </body>
    </html>
  )
}