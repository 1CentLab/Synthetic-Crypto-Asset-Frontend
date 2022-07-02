import React, { useEffect, useState,useCallback } from 'react';
import { Fee, MsgSend, MsgExecuteContract } from '@terra-money/terra.js';

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

    const proceed = useCallback(() => {
        if (!connectedWallet) {
          return;
        }
    
        if (connectedWallet.network.chainID.startsWith('columbus')) {
          alert(`Please only execute this example on Testnet`);
          return;
        }
    
        setTxResult(null);
        setTxError(null);
    
        connectedWallet
          .post({
            msgs: [
              new MsgExecuteContract(connectedWallet.walletAddress, USD, {
                  "transfer": {
                      "recipient": "terra1u46xvk5vyq466j4ahk3awd7aj44gc4rzf4epxr",
                      "amount": "10000"
                  }
              })
              
            ],
          })
          .then((nextTxResult: TxResult) => {
            console.log(nextTxResult);
            setTxResult(nextTxResult);
          })
          .catch((error: unknown) => {
              console.log(error)
            if (error instanceof UserDenied) {
              setTxError('User Denied');
            } else if (error instanceof CreateTxFailed) {
              setTxError('Create Tx Failed: ' + error.message);
            } else if (error instanceof TxFailed) {
              setTxError('Tx Failed: ' + error.message);
            } else if (error instanceof Timeout) {
              setTxError('Timeout');
            } else if (error instanceof TxUnspecifiedError) {
              setTxError('Unspecified Error: ' + error.message);
            } else {
              setTxError(
                'Unknown Error: ' +
                  (error instanceof Error ? error.message : String(error)),
              );
            }
          });
      }, [connectedWallet]);
    
  
    return (
      <div>
      
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