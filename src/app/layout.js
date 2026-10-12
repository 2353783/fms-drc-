'use client';

import { LanguageProvider } from '../components/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <title>FMS - Financial Managing Support | Ressources Humaines</title>
        <meta name="description" content="FMS - Votre partenaire RH de confiance. Services de placement, recrutement, formation, fiscalité, finance et immigration." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/logo.png?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/logo.png?v=2" />
      </head>
      <body>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
