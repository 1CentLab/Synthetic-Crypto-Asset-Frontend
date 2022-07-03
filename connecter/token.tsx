import React, { useEffect, useState,useCallback } from 'react';
import { Fee, MsgSend, MsgExecuteContract } from '@terra-money/terra.js';
import { ConnectedWallet } from '@terra-money/wallet-types';
import { LCDClient } from '@terra-money/terra.js';
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



class CW20 {
    lcd: LCDClient;
    connectedWallet: ConnectedWallet;
    constructor(lcd :LCDClient, connected_wallet:ConnectedWallet){
        this.lcd = lcd;
        this.connectedWallet = connected_wallet;
    } 

    async transfer() :Promise<any>{
        let result = await this.connectedWallet
          .post({
            msgs: [
              new MsgExecuteContract(this.connectedWallet.walletAddress, "terra1x7cz2xjsp2dcppwm33325nl7epyp3cc0u2lf2dl20qynylupmq2qxcuech", {
                  "transfer": {
                      "recipient": "terra1u46xvk5vyq466j4ahk3awd7aj44gc4rzf4epxr",
                      "amount": 10000
                  }
              })
              
            ],
          })
        return result;
    }

    async increaseAllowance() :Promise<any>{
      let result = await this.connectedWallet
        .post({
          msgs: [
            new MsgExecuteContract(this.connectedWallet.walletAddress, "terra1x7cz2xjsp2dcppwm33325nl7epyp3cc0u2lf2dl20qynylupmq2qxcuech", {
                "increase_allowance": {
                    "recipient": "terra1u46xvk5vyq466j4ahk3awd7aj44gc4rzf4epxr",
                    "amount": 10000
                }
            })
            
          ],
        })
      return result;
  }
}

export default CW20