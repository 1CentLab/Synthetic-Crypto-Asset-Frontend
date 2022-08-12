import React, { useEffect, useState, useCallback } from 'react';
import { Fee, MsgSend, MsgExecuteContract } from '@terra-money/terra.js';
import { ConnectedWallet } from '@terra-money/wallet-types';
import { LCDClient } from '@terra-money/terra.js';
import { BalanceResponse, AllowanceResponse } from '../interface/token';

import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxResult,
  TxUnspecifiedError,
  useConnectedWallet,
  useLCDClient,
  UserDenied,
} from '@terra-money/wallet-provider';
import BigNumber from 'bignumber.js';
import { decimalScale } from '../common/constant';

class CW20 {
  lcd: LCDClient;
  token_addr: string;
  constructor(lcd: LCDClient, tokenAddr: string) {
    this.lcd = lcd;
    this.token_addr = tokenAddr;
  }

  // query functions
  async allowance(owner: string, spender: string): Promise<AllowanceResponse> {
    let result = await this.lcd.wasm.contractQuery<AllowanceResponse>(this.token_addr, {
      allowance: {
        owner: owner,
        spender: spender,
      },
    });
    return result;
  }

  async balanceOf(address: string): Promise<BalanceResponse> {
    let result = await this.lcd.wasm.contractQuery<BalanceResponse>(this.token_addr, {
      balance: {
        address: address,
      },
    });
    return result;
  }

  async transfer(connected_wallet: ConnectedWallet, recipient: string, amount: string): Promise<any> {
    let result = await connected_wallet.post({
      msgs: [
        new MsgExecuteContract(connected_wallet.walletAddress, this.token_addr, {
          transfer: {
            recipient: recipient,
            amount: amount,
          },
        }),
      ],
    });
    return result;
  }

  async increaseAllowance(connected_wallet: ConnectedWallet, spender: string, amount: string): Promise<any> {
    let result = await connected_wallet.post({
      msgs: [
        new MsgExecuteContract(connected_wallet.walletAddress, this.token_addr, {
          increase_allowance: {
            spender: spender,
            amount: new BigNumber(amount)
              .decimalPlaces(6)
              .multipliedBy(decimalScale)

              .toString(),
          },
        }),
      ],
    });
    return result;
  }
}

export default CW20;
