import { useLCDClient } from '@terra-money/wallet-provider';
import BigNumber from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import ORACLE from '../connecter/oracle';

type Props = {};

function useToken({}: Props) {
  const [gold, setGold] = useState('0');
  const lcd = useLCDClient();
  const intervalRef = useRef<NodeJS.Timer>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const gold = new ORACLE(lcd);
        const result = await gold.get_price();
        const { multiplier, price } = result as any;
        console.log(result, 'thangpham1');
        const priceGold = new BigNumber(price).div(multiplier).toString();
        setGold(priceGold);
      } catch (error) {
        console.log(error);
      }
    };
    let interval = setInterval(() => {
      fetchData();
    }, 5000);
    intervalRef.current = interval;
    fetchData();
    return () => clearInterval(interval);
  }, [lcd]);
  return gold;
}

export default useToken;
