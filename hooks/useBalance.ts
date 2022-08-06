import { LCDClient } from '@terra-money/terra.js';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import BigNumber from 'bignumber.js';
import { useContext, useEffect, useState } from 'react';
import {
  CONTROLLER_CONTRACT_ADDR,
  decimalScale,
  PAIR_CONTRACT_ADDR,
  SCA_CONTRACT_ADDR,
  USD_CONTRACT_ADDR,
} from '../common/constant';
import Pair from '../connecter/pair';
import CW20 from '../connecter/token';
import { LoadingContext } from '../pages/_app';

export const useBalance = ({ contractAllowcen, contractToken }: any) => {
  const [balance, setBalance] = useState({ sca: '', usd: '', scaAllowed: '', usdAllowed: '' });
  const lcd = useLCDClient();
  const { isLoading } = useContext(LoadingContext) as any;
  const connectedWallet = useConnectedWallet();
  console.log(balance);
  useEffect(() => {
    if (connectedWallet) {
      let sca = new CW20(lcd, SCA_CONTRACT_ADDR);
      let usd = new CW20(lcd, USD_CONTRACT_ADDR);
      const { walletAddress } = connectedWallet;
      const fetching = async () => {
        let balance0 = sca.balanceOf(walletAddress);
        let balance1 = usd.balanceOf(walletAddress);
        let allowance1 = sca.allowance(walletAddress, contractAllowcen);
        let allowance2 = usd.allowance(walletAddress, contractAllowcen);

        Promise.all([balance0, balance1, allowance1, allowance2])
          .then((values) => {
            console.log(values);
            setBalance((prevState) => ({
              ...prevState,
              sca: new BigNumber(values[0].balance).div(decimalScale).toString(),
              usd: new BigNumber(values[1].balance).div(decimalScale).toString(),
              scaAllowed: new BigNumber(values[2].allowance).div(decimalScale).toString(),
              usdAllowed: new BigNumber(values[3].allowance).div(decimalScale).toString(),
            }));
            if (contractToken === USD_CONTRACT_ADDR) {
            }
          })
          .catch((error: any) => {
            console.log(error);
          });
      };
      fetching();
    }
  }, [connectedWallet, lcd, isLoading]);
  return { ...balance };
};
