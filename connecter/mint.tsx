import React, { useEffect, useState, useCallback } from 'react';
import { Fee, MsgSend, MsgExecuteContract } from '@terra-money/terra.js';
import { ConnectedWallet } from '@terra-money/wallet-types';
import { LCDClient } from '@terra-money/terra.js';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { ReserveResponse } from '../interface/pair';
import { MINT_CONTRACT_ADDR } from '../common/constant';
import BigNumber from 'bignumber.js';

class Mint {
  lcd: LCDClient;
  mint_address: string;
  constructor(lcd: LCDClient) {
    this.lcd = lcd;
    this.mint_address = MINT_CONTRACT_ADDR;
  }

  // Query
  async open_position(connectedWallet: ConnectedWallet, collateral_amount: string, ratio: string) {
    console.log(collateral_amount, ratio);
    const collateralAmountConvertDecimal = new BigNumber(collateral_amount).multipliedBy(10 ** 6).toString();
    const ratioConvertDecimal = new BigNumber(ratio).multipliedBy(10 ** 4).toString();

    let result = await connectedWallet.post({
      msgs: [
        new MsgExecuteContract(connectedWallet.walletAddress, this.mint_address, {
          open_position: {
            collateral_amount: collateralAmountConvertDecimal,
            ratio: ratioConvertDecimal,
          },
        }),
      ],
    });
    return result;
  }
}

export default Mint;
