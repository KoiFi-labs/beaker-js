import '../styles/globals.css'
import type { AppProps } from "next/app"
import Head from "next/head"
import { PeraProvider } from '../src/contexts/usePera'
import { MyAlgoProvider } from '../src/contexts/useMyAlgo'
import { NextUIProvider, createTheme } from '@nextui-org/react';
import { Layout } from '../src/components/Layout/Layout'
import { themeConfig } from '../styles/themeConfig'


const theme = createTheme(themeConfig)



export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
        <Head>
          <title>KoiFi Protocol</title>
        </Head>
        <NextUIProvider theme={theme}>
          <PeraProvider>
            <MyAlgoProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </MyAlgoProvider>
          </PeraProvider>
        </NextUIProvider>
    </>
)}






  

