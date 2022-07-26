import React, { useEffect, useState, useCallback } from 'react';
import { Fee, MsgSend, MsgExecuteContract } from '@terra-money/terra.js';
import { ConnectedWallet } from '@terra-money/wallet-types';
import { LCDClient } from '@terra-money/terra.js';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { ReserveResponse } from '../interface/pair';

class Pair {
  lcd: LCDClient;
  pair_addr: string;
  constructor(lcd: LCDClient, pair_addr: string) {
    this.lcd = lcd;
    this.pair_addr = pair_addr;
  }

  // Query
  async get_reserves(): Promise<ReserveResponse> {
    let result = await this.lcd.wasm.contractQuery<ReserveResponse>(this.pair_addr, {
      get_reserves: {},
    });
    return result;
  }

  //Execute
  async add_liquid(caller: ConnectedWallet, amount0: string, amount1: string) {
    console.log({
      add_liquid: {
        amount0: amount0,
        amount1: amount1,
      },
    });
    let result = await caller.post({
      msgs: [
        new MsgExecuteContract(caller.walletAddress, this.pair_addr, {
          add_liquid: {
            amount0: amount0,
            amount1: amount1,
          },
        }),
      ],
    });
    return result;
  }

  async swap(caller: ConnectedWallet, amount: string, addressToken: string, mainToken: string, secondToken: string) {
    let result = await caller.post({
      msgs: [
        new MsgExecuteContract(caller.walletAddress, this.pair_addr, {
          swap: {
            amount_in: amount,
            path: [mainToken, secondToken],
          },
        }),
      ],
    });
  }
}

export default Pair;
