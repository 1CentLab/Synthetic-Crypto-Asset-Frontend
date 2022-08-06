import {
  getChainOptions,
  StaticWalletProvider,
  WalletControllerChainOptions,
  WalletProvider,
} from '@terra-money/wallet-provider';
import { AppProps } from 'next/app';
import { createContext, useState } from 'react';
import Nav from '../components/Common/Nav';

import 'antd/dist/antd.css';
import { Footer } from 'antd/lib/layout/layout';
import dynamic from 'next/dynamic';
import '../styles/_app.scss';
export const LoadingContext = createContext({});
const ModalLoading = dynamic(() => import('../components/ModalLoading'), {
  ssr: false,
});
export default function App({
  Component,
  defaultNetwork,
  walletConnectChainIds,
}: AppProps & WalletControllerChainOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const main = (
    <main>
      <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        <header>
          <Nav />
        </header>

        <Component />
        <ModalLoading />
        <Footer style={{ textAlign: 'center' }}>SYNTHETIC CRYPTO ASSETS@2022 create by FreeGuys</Footer>
      </LoadingContext.Provider>
    </main>
  );

  return typeof window !== 'undefined' ? (
    <WalletProvider defaultNetwork={defaultNetwork} walletConnectChainIds={walletConnectChainIds}>
      {main}
    </WalletProvider>
  ) : (
    <StaticWalletProvider defaultNetwork={defaultNetwork}>{main}</StaticWalletProvider>
  );
}

App.getInitialProps = async () => {
  const chainOptions = await getChainOptions();
  return {
    ...chainOptions,
  };
};
