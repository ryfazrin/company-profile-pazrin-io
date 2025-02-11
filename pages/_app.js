import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [shouldLoadScript, setShouldLoadScript] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const urlParams = new URLSearchParams(window.location.search);
    const isWebWorkerEnabled = urlParams.get('webworker') === 'true';

    setShouldLoadScript(isWebWorkerEnabled);

    if (isWebWorkerEnabled) {
      // Tambahkan konfigurasi web worker
      const fernflowScript = document.createElement('script');
      fernflowScript.innerHTML = `
        window.fernflow = {
          resolveUrl(url, location) {
            if (
              url.hostname.includes('syndication.twitter.com') ||
              url.hostname.includes('cdn.syndication.twimg.com') ||
              url.hostname.includes('connect.facebook.net')
            ) {
              const proxyUrl = new URL('https://pazrin-proxy-api.deno.dev/proxy-api');
              proxyUrl.searchParams.append('url', url);
              return proxyUrl;
            }
          },
          forward: ["fbq", "dataLayer.push"],
          logCalls: true,
          logGetters: true,
          logSetters: true,
          logImageRequests: true,
          logMainAccess: true,
          logSendBeaconRequests: true,
          logStackTraces: false,
          logScriptExecution: true,
        };
      `;
      document.body.appendChild(fernflowScript);

      // Web Worker
      const script = document.createElement('script');
      script.src = "/~fernflow/debug/tool-web-worker.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(fernflowScript);
        document.body.removeChild(script);
      };
    }
  }, [router.isReady]);

  return (
    <>
      {/* Jika Web Worker aktif, ubah type script menjadi "text/fernflow" */}
      <script
        async
        type={shouldLoadScript ? "text/fernflow" : "text/javascript"}
        src="https://platform.twitter.com/widgets.js"
        charSet="utf-8"
      />

      <Script
        id="gtm"
        type={shouldLoadScript ? "text/fernflow" : "text/javascript"} 
        strategy="afterInteractive"
      >
        {`
          (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ 'gtm.start': new Date().getTime(), 'event': 'gtm.js' });
            var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
          })(window, document, 'script', 'dataLayer', 'GTM-WRNP3NZ');
        `}
      </Script>

      <Script 
        id="facebook-pixel"
        type={shouldLoadScript ? "text/fernflow" : "text/javascript"} 
        strategy="afterInteractive"
      >
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '987747585216906');
          fbq('track', 'PageView');
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
