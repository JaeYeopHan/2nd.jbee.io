import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import '~/styles/article.css';
import '~/styles/global.css';
import '~/styles/reset.css';
import BlogConfig from '../blog.config';
import { Container } from './components/container/Container';
import { GlobalNavigationBar } from './components/gnb/GlobalNavigationBar';
import { GoogleAnalyticsScripts } from './utils/ga/google-analytics';
import { createSitemapLink } from './utils/sitemap/link';
import { createRSSLink } from './utils/rss/link';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css' },
  { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css' },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icon/favicon-32x32.png' },
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icon/favicon-16x16.png' },
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'manifest', href: '/icon/site.webmanifest' },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/icon/apple-touch-icon.png' },
  createSitemapLink(),
  createRSSLink()
];

export default function App() {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <GoogleAnalyticsScripts id={BlogConfig.ga.id} />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <GlobalNavigationBar />
      {children}
    </Container>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  function parseError(error: unknown) {
    if (isRouteErrorResponse(error)) {
      return `${error.status} ${error.statusText}`;
    }if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown Error';
  }

  return (
    <html lang='ko'>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <h1>{parseError(error)}</h1>
        </Layout>
        <Scripts />
      </body>
    </html>
  );
}
