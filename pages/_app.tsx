import {
  getChainOptions,
  StaticWalletProvider,
  WalletControllerChainOptions,
  WalletProvider,
} from '@terra-money/wallet-provider';
import { AppProps } from 'next/app';
import { createContext, useState } from 'react';
import Nav from '../components/Common/Nav';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css';
import { Footer } from 'antd/lib/layout/layout';
import dynamic from 'next/dynamic';
import '../styles/_app.scss';
import HeaderPrice from '../components/HeaderPrice';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
export const LoadingContext = createContext({});
import favicon from '../public/favicon.png';
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
        <Head>
          <link rel="shortcut icon" href="/static/favicon.png" />
        </Head>
        <header>
          <Nav />
        </header>
        <Component />
        <ModalLoading />
        <Footer style={{ textAlign: 'center' }}>SYNTHETIC CRYPTO ASSETS@2022 create by FreeGuys</Footer>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </LoadingContext.Provider>
    </main>
  );

  return typeof window !== 'undefined' ? (
    <WalletProvider defaultNetwork={defaultNetwork} walletConnectChainIds={walletConnectChainIds}>
      {<>{main}</>}
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
