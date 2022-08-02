import { useLCDClient } from '@terra-money/wallet-provider';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import ORACLE from '../connecter/oracle';

type Props = {};

function useToken({}: Props) {
  const [gold, setGold] = useState('0');
  const lcd = useLCDClient();
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
    fetchData();
  }, [lcd]);
  return gold;
}

export default useToken;
