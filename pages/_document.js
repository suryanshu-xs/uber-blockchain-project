import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html className='no-scrollbar'>
            <Head >
                <link href='https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css' rel='stylesheet' />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>
            <body  >
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}