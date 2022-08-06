import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { decimalScale } from '../common/constant';
import Mint from '../connecter/mint';
import ORACLE from '../connecter/oracle';

type Props = {};

function usePosition({}: Props) {
  const [position, setPosition] = useState({});
  const connectedWallet = useConnectedWallet();
  const intervalRef = useRef<NodeJS.Timer>();
  console.log(connectedWallet, 'thangpham1');
  const lcd = useLCDClient();
  useEffect(() => {
    if (connectedWallet) {
      const fetchData = async () => {
        const { walletAddress } = connectedWallet;
        try {
          const mint = new Mint(lcd);
          const result = await mint.get_open_position(walletAddress);
          if (!_.isEmpty(result)) {
            const initDeb = new BigNumber((result as any)?.initial_debt).div(decimalScale).toString();
            const entryPrice = new BigNumber((result as any)?.entry_price).div(decimalScale).toString();
            const initSize = new BigNumber((result as any)?.initial_size).div(decimalScale).toString();
            const deb = new BigNumber((result as any)?.debt).div(decimalScale).toString();
            const convertData = {
              ...(result as any),
              entry_price: entryPrice,
              initial_debt: initDeb,
              initial_size: initSize,
              debt: deb,
            };
            setPosition(convertData);
          }
        } catch (error) {
          console.log(error);
        }
      };

      let interval = setInterval(() => {
        fetchData();
      }, 5000);
      intervalRef.current = interval;
    }
  }, [lcd, connectedWallet]);
  return position;
}

export default usePosition;