import React, { useEffect, useState, useCallback } from 'react';
import { Fee, MsgSend, MsgExecuteContract } from '@terra-money/terra.js';
import { ConnectedWallet } from '@terra-money/wallet-types';
import { LCDClient } from '@terra-money/terra.js';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { ReserveResponse } from '../interface/pair';
import { decimalScale, MINT_CONTRACT_ADDR } from '../common/constant';
import BigNumber from 'bignumber.js';

class Mint {
  lcd: LCDClient;
  address: string;
  constructor(lcd: LCDClient) {
    this.lcd = lcd;
    this.address = MINT_CONTRACT_ADDR;
  }

  // Query
  async open_position(connectedWallet: ConnectedWallet, collateral_amount: string, ratio: string) {
    console.log(collateral_amount, ratio);
    const collateralAmountConvertDecimal = new BigNumber(collateral_amount).multipliedBy(10 ** 6).toString();
    const ratioConvertDecimal = new BigNumber(ratio).multipliedBy(10 ** 4).toString();

    let result = await connectedWallet.post({
      msgs: [
        new MsgExecuteContract(connectedWallet.walletAddress, this.address, {
          open_position: {
            collateral_amount: collateralAmountConvertDecimal,
            ratio: ratioConvertDecimal,
          },
        }),
      ],
    });
    return result;
  }

  async get_open_position(user: string) {
    let result = await this.lcd.wasm.contractQuery(this.address, {
      get_position: {
        user: user,
      },
    });
    return result;
  }

  async close_position(connectedWallet: ConnectedWallet, amount: string) {
    await connectedWallet.post({
      msgs: [
        new MsgExecuteContract(connectedWallet.walletAddress, this.address, {
          close_position: {
            sca_amount: new BigNumber(amount).multipliedBy(decimalScale).toString(),
          },
        }),
      ],
    });
  }
}

export default Mint;
