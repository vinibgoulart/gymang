import type { AppProps } from 'next/app';

import '../root.css';
import { ReactRelayContainer } from '../relay/ReactRelayContainer';

export default function App({ Component, pageProps }: AppProps) {
  return <ReactRelayContainer Component={Component} props={pageProps} />;
}
