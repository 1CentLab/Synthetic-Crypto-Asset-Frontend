import React, { useEffect, useState,useCallback } from 'react';
import { Fee, MsgSend, MsgExecuteContract } from '@terra-money/terra.js';
import CW20 from "../../../connecter/token"
import Link from "next/link";
import Pair from "../../../connecter/pair"
const contract_addr = require("../../../data/contracts.json");

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

export default function AddLiquid() {
    const lcd = useLCDClient();
    const connectedWallet = useConnectedWallet();
    let pair = new Pair(lcd, contract_addr['pair'])

    const [bank, setBank] = useState<null | string>();
    const [txResult, setTxResult] = useState<TxResult | null>(null);
    const [txError, setTxError] = useState<string | null>(null);
    
    const [pairData, setPair] = useState({
        "token0": "",
        "token1": "",
        "amount0": 0,
        "amount1": 0
    })

    // HAndle when user reconnect 
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

   
    //todo: it is being called many time -> being delayed. Handle this issue
    const handleParam =  () => async (e: { target: { name: any; value: any; }; }) => {
        const name = e.target.name;
        const value = e.target.value * 10 ** 6; //todo: using bignumber here

        //get reserves 
        let reserves = await pair.get_reserves();

        console.log(reserves.reserve0)

        setPair((prevState) => ({
            ...prevState,
            [name]: value
          }));
        
        console.log(pair)
      };

    const formSubmit = useCallback(async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!connectedWallet) {
          return;
        }
        let token = new CW20(lcd, connectedWallet);
        token.transfer().then((nextTxResult: TxResult)=>{console.log(nextTxResult)}).catch((error:any)=>{console.log(error.message)})
      }, [connectedWallet]);
    
  
    return (
      <div className='relative flex flex-wrap items-center justify-between px-2 py-3 mb-3 '>
        
        <div className="container px-4 mx-auto flex items-center flex-col">
          <div className="trade-header flex justify-between items-center">
                <Link href="/trade/swap">
                  <a
                    className="px-3 py-2 mx-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 bg-slate-400"
                  >
                    <span className="ml-2">Swap</span>
                  </a>
                </Link>

                <Link href="/trade/liquidity">
                  <a
                    className="px-3 py-2 mx-2  flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 bg-slate-400"
                  >
                    <span className="ml-2">Liquidity</span>
                  </a>
                </Link>
          </div>
          <div className="trade-content my-5 flex flex-row justify-between">
            <div className="trade-board">
              <div className="form-block my-2">
                    Add liquidity
              </div>
            
            <div className="add-liquid-form">
                <form onSubmit={formSubmit}>
                    <div>
                    <label>GOLD</label>
                    <input
                        type="number"
                        name="amount0"
                        step="0.01"
                        required
                        placeholder="Name"
                        className="form-control"
                        value={pairData.amount0 / (10**6)}
                        onChange={handleParam()}
                    />
                    </div>
                    <div>
                    <label>USD</label>
                    <input
                        type="number"
                        step="0.01"
                        name="amount1"
                        required
                        placeholder="Email"
                        className="form-control"
                        value={pairData.amount1 /(10**6)}
                        onChange={handleParam()}
                    />
                    </div>
                    
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add
                    </button>
                </form>
            </div>

          
            </div>
           
           </div>
         </div>
      </div>
    );
}