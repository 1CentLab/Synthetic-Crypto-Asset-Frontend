import React, { useEffect, useState,useCallback } from 'react';
import { Fee, MsgSend, MsgExecuteContract } from '@terra-money/terra.js';
import CW20 from "../connecter/token"

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

export default function Trade() {
    const lcd = useLCDClient();
    const connectedWallet = useConnectedWallet();

    const [bank, setBank] = useState<null | string>();
    const [txResult, setTxResult] = useState<TxResult | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const USD="terra1x7cz2xjsp2dcppwm33325nl7epyp3cc0u2lf2dl20qynylupmq2qxcuech"
  
  
    useEffect(() => {
      if (connectedWallet) {
         const fetching = async () => {
            let data =await lcd.wasm.contractQuery(
                "terra1x7cz2xjsp2dcppwm33325nl7epyp3cc0u2lf2dl20qynylupmq2qxcuech",
                {
                    "balance": {
                        "address": connectedWallet.walletAddress
                    }
                }
            );
            console.log(`Addr :${connectedWallet.walletAddress}`)
            console.log(`Data ${JSON.stringify(data)}`)
         }
        // fetching()

        lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
          setBank(coins.toString());
        });
      } else {
        setBank(null);
      }
    }, [connectedWallet, lcd]);

    const proceed = useCallback(async() => {
        if (!connectedWallet) {
          return;
        }
        let token = new CW20(lcd, connectedWallet);
        token.transfer().then((nextTxResult: TxResult)=>{console.log(nextTxResult)}).catch((error:any)=>{console.log(error.message)})
      }, [connectedWallet]);
    
  
    return (
      <div>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>

        <div className="trade">
          <div className="trade-header">
              <p> Trade header</p>
          </div>
          <div className="trade-content">
            <div className="trade-board">
                <p>Trade board</p>
            </div>
            <div className="trade-info">
                <p>Trade info</p>
            </div>
           </div>
         </div>
      </div>
    );
}