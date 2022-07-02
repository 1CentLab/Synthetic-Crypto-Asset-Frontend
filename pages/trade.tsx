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
        let status = await token.transfer();
        console.log("Hey i call use call back")
        console.log(status)
    
      }, [connectedWallet]);
    
  
    return (
      <div>
          <h1>Helo</h1> 
      
        {bank && <pre>{bank}</pre>}
        {!connectedWallet && <p>Wallet not connected!</p>}

        {connectedWallet?.availablePost && !txResult && !txError && (
            <button onClick={proceed}>Send CW20</button>
        )}
        {txResult && (
        <>
          <pre>{JSON.stringify(txResult, null, 2)}</pre>
          {connectedWallet && txResult && (
            <div>
            <a
              href={`https://finder.terra.money/${connectedWallet.network.chainID}/tx/${txResult.result.txhash}`}
              target="_blank"
              rel="noreferrer"
            >
              Open Tx Result in Terra Finder
            </a>
            </div>
          )}
           {txError && <pre>{txError}</pre>}

            {(!!txResult || !!txError) && (
            <button
                onClick={() => {
                setTxResult(null);
                setTxError(null);
                }}
            >
                Clear result
            </button>
            )}
        </>
      )}
      </div>
    );
}