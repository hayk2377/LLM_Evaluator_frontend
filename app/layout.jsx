import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'LLM Parameter Visualizer • SSR Dashboard',
  description: 'SEO-friendly, SSR dashboard to explore Temperature & Top-P effects on LLM outputs with modular Redux state and rich visualizations.',
  openGraph: {
    title: 'LLM Parameter Visualizer',
    description: 'Compare LLM outputs across Temperature & Top-P. Heatmaps, radar and more.',
    url: 'https://example.com',
    siteName: 'LLM Parameter Visualizer',
    images: [],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLM Parameter Visualizer',
    description: 'Explore Temperature & Top-P effects on LLM outputs.'
  },
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(()=>{try{const t=localStorage.getItem('theme');const m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches; if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');} else {document.documentElement.classList.remove('dark');}}catch(e){}})();` }} />
      </head>
      <body className={`font-sans bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
