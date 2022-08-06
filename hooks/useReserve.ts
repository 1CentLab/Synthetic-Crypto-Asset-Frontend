import { useLCDClient } from '@terra-money/wallet-provider';
import BigNumber from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import { PAIR_CONTRACT_ADDR } from '../common/constant';
import ORACLE from '../connecter/oracle';
import Pair from '../connecter/pair';

type Props = {};

function useReserve({}: Props) {
  const [reserve, setReserve] = useState('0');
  const lcd = useLCDClient();
  const intervalRef = useRef<NodeJS.Timer>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pair = new Pair(lcd, PAIR_CONTRACT_ADDR);
        const { reserve0 = '1', reserve1 = '1' } = await pair.get_reserves();
        console.log(reserve0, reserve1, 'reserve0, reserve1');
        setReserve(new BigNumber(reserve0).div(reserve1).toString());
      } catch (error) {
        console.log(error);
      }
    };
    let interval = setInterval(() => {
      fetchData();
    }, 2000);
    intervalRef.current = interval;
    fetchData();
    return () => clearInterval(interval);
  }, [lcd]);
  return reserve;
}

export default useReserve;
