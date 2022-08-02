import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import Mint from '../connecter/mint';
import ORACLE from '../connecter/oracle';

type Props = {};

function usePosition({}: Props) {
  const [gold, setGold] = useState('0');
  const connectedWallet = useConnectedWallet();
  console.log(connectedWallet, 'thangpham1');
  const lcd = useLCDClient();
  useEffect(() => {
    if (connectedWallet) {
      const fetchData = async () => {
        const { walletAddress } = connectedWallet;
        try {
          const mint = new Mint(lcd);
          const result = await mint.get_open_position(walletAddress);
          console.log(result, 'thangpham1');
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [lcd, connectedWallet]);
  return gold;
}

export default usePosition;
