import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import '../styles/globals.css';

// Fungsi untuk log call stack dan kedalamannya
const logCallStack = function(context) {
  try {
    var stack = new Error().stack ? new Error().stack.split('\n').slice(1) : [];
    window._callStackDepths = window._callStackDepths || [];
    window._callStackDepths.push(stack.length);
    console.log('[CallStack][Main][' + context + '] Kedalaman: ' + stack.length);
    // console.trace(); // Uncomment jika ingin melihat trace detail
  } catch (e) {
    console.error('[CallStack][Main thread][' + context + '] Error logging call stack:', e);
  }
};

function MyApp({ Component, pageProps }) {
  // Log the call stack to measure main thread stack
  logCallStack('Main thread');
  
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
      {/* Google Tag Manager */}
      <Script id="gtm" strategy="afterInteractive">
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
      {/* Facebook Pixel */}
      <Script id="facebook-pixel" strategy="afterInteractive">
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
