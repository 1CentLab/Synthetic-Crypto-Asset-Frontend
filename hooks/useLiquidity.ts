import React, { useEffect, useState } from 'react';

type Props = {};

function useLiquidity({}: Props) {
  const [liquidity, setLiquidity] = useState({ usdAmount: '0', scaAmoun: '' });

  useEffect(() => {
    

  }, []);
  return { ...liquidity };
}

export default useLiquidity;
