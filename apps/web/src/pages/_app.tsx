import type { AppProps } from "next/app";
import "../root.css";

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
}
