import React, { useEffect, useState,useCallback } from 'react';
import { Fee, MsgSend, MsgExecuteContract } from '@terra-money/terra.js';
import CW20 from "../../connecter/token"
import Link from "next/link";


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

    const test = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
    }

    const proceed = useCallback(async(e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault
        if (!connectedWallet) {
          return;
        }
        let token = new CW20(lcd, connectedWallet);
        token.transfer().then((nextTxResult: TxResult)=>{console.log(nextTxResult)}).catch((error:any)=>{console.log(error.message)})
      }, [connectedWallet]);
    
  
    return (
      <div className='relative flex flex-wrap items-center justify-between px-2 py-3 mb-3 '>
        
        <div className="container px-4 mx-auto flex items-center flex-col">
          <div className="trade-header">
          <Link href="/trade/swap">
                  <a
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug  hover:opacity-75"
                  >
                    <span className="ml-2">Swap</span>
                  </a>
                </Link>

                <Link href="/trade/liquidity">
                  <a
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug  hover:opacity-75"
                  >
                    <span className="ml-2">Liquidity</span>
                  </a>
                </Link>
          </div>
          <div className="trade-content flex flex-row justify-between">
            <div className="trade-board">
              <div className="form-block">
                
              </div>
          
            </div>
            <div className="trade-info">
                <p>Trade info</p>
            </div>
           </div>
         </div>
      </div>
    );
}