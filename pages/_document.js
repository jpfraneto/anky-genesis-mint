import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add your Google site verification meta tag here */}
        <meta
          name="google-site-verification"
          content="l10zz5xHZ-8fGVFaKPYKh17XweK64UA0jf2XwGsw194"
        />
        {/* Other meta tags, like for fonts or favicons, can also be included here */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
