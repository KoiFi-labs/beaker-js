import '../styles/globals.css'
import type { AppProps } from "next/app"
import { PeraProvider } from '../src/contexts/usePera'

export default function App({ Component, pageProps }: AppProps) {
  return (
  <PeraProvider>
    <Component {...pageProps} />
  </PeraProvider>)
}
