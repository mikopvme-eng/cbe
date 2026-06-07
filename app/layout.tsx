import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CBE Mobile Banking",
  description:
    "Commercial Bank of Ethiopia Mobile Banking App - Send money, view receipts, manage your accounts securely",
  generator: "v0.app",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CBE Bank",
  },
  icons: {
    icon: "/cbe-logo.png",
    apple: "/cbe-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          html {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          code, pre {
            font-family: 'Monaco', 'Courier New', monospace;
          }
        `}</style>
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CBE Bank" />
        <link rel="apple-touch-icon" href="/cbe-logo.png" />
        <link rel="icon" type="image/png" href="/cbe-logo.png" />
        <link rel="shortcut icon" href="/cbe-logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {children}
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/service-worker.js').then(
                    function(registration) {
                      console.log('[App] Service Worker registered:', registration);
                    },
                    function(err) {
                      console.log('[App] Service Worker registration failed:', err);
                    }
                  );
                });
              }
              
              // Handle PWA install prompt
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                console.log('[App] Install prompt available');
              });
              
              // Listen for app installed
              window.addEventListener('appinstalled', () => {
                console.log('[App] PWA was installed');
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
