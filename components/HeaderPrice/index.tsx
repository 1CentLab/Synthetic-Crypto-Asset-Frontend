import BigNumber from 'bignumber.js';
import React from 'react';
import { decimalScale } from '../../common/constant';
import useReserve from '../../hooks/useReserve';
import useToken from '../../hooks/useToken';
import goldIcon from '../../public/dollar-coin.png';
type Props = {};

const HeaderPrice = (props: Props) => {
  const offChain = useToken({}); //offchain
  const onChain = useReserve({});
  return (
    <div className="container flex justify-center flex-col items-center mb-10 ">
      <div className="flex justify-center">
        <p className="drop-shadow">Price (OFF/ON) chain:</p>
        <img
          width={20}
          height={20}
          className="mr-2 ml-1"
          src={'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Gold_coin_icon.png/800px-Gold_coin_icon.png'}
          alt="#"
        ></img>{' '}
        <p style={{ color: 'rgb(66, 184, 131)' }} className="font-semibold drop-shadow">
          {' '}
          {new BigNumber(offChain).toFixed(6).toString()}:{' '}
          {onChain !== '0' ? new BigNumber(1).div(onChain).toFixed(6).toString() : '0.000000'}
        </p>
      </div>
    </div>
  );
};

export default HeaderPrice;
