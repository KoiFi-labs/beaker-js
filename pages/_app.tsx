import "../styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { SandboxProvider } from "../src/contexts/useSandbox"
import { WalletProvider } from "../src/contexts/useWallet"
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { Layout } from "../src/components/Layout/Layout"
import { themeConfig } from "../styles/themeConfig"
import { SSRProvider } from "@react-aria/ssr"

const theme = createTheme(themeConfig)


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
        <Head>
          <title>Kondor Protocol</title>
        </Head>
      <SSRProvider>
        <NextUIProvider theme={theme}>
          <SandboxProvider>
                <WalletProvider>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                </WalletProvider>
          </SandboxProvider>
        </NextUIProvider>
      </SSRProvider>
    </>
)}






  

