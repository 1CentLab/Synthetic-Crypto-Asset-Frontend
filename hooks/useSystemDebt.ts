import { useLCDClient } from '@terra-money/wallet-provider';
import BigNumber from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import CONTROLLER from '../connecter/controller';
import ORACLE from '../connecter/oracle';

type Props = {};

function useSystemDebt({}: Props) {
  const [systemDebt, setSystemDebt] = useState({ system_debt: '0' });
  const lcd = useLCDClient();
  const intervalRef = useRef<NodeJS.Timer>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const controller = new CONTROLLER(lcd);
        const result = await controller.get_asset_state();
        const { system_debt, reserve } = result as any;
        setSystemDebt({ system_debt });
      } catch (error) {
        console.log('error', error);
      }
    };
    let interval = setInterval(() => {
      fetchData();
    }, 5000);
    intervalRef.current = interval;
    fetchData();
    return () => clearInterval(interval);
  }, [lcd]);
  return systemDebt;
}

export default useSystemDebt;
