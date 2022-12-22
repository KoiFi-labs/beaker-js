import '../styles/globals.css'
import type { AppProps } from "next/app"
import Head from "next/head"
import { PeraProvider } from '../src/contexts/usePera'
import { NextUIProvider, createTheme } from '@nextui-org/react';
import { Layout } from '../src/components/Layout/Layout';


const theme = createTheme({
  type: "dark",
  theme: {
    colors: {
      primaryLight: '$green200',
      primaryLightHover: '$green300',
      primaryLightActive: '$green400',
      primaryLightContrast: '$green600',
      primary: '#4ADE7B',
      primaryBorder: '$green500',
      primaryBorderHover: '$green600',
      primarySolidHover: '$green700',
      primarySolidContrast: '$white',
      primaryShadow: '$green500',
      transparent: '#ff000020',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
      link: '#5E1DAD',
    },
    space: {},
    fonts: {}
  }
})



export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>KoiFi Protocol</title>
      </Head>
      <NextUIProvider theme={theme}>
      <PeraProvider>
        <Layout>
            <Component {...pageProps} />
          </Layout>
        </PeraProvider>
      </NextUIProvider>
    </>
)}






  

