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
    let pair = new Pair(lcd, contract_addr['pair']);
    let sca = new CW20(lcd, contract_addr['sca']);
    let usd = new CW20(lcd, contract_addr['usd']);

    const [txResult, setTxResult] = useState<TxResult | null>(null);
    const [txError, setTxError] = useState<string | null>(null);

    let [tokenAddr, setTokenAddr] = useState({
      "token0": contract_addr['sca'],
      "token1": contract_addr['usd'],
      "decimal0":contract_addr['sca_decimal'],
      "decimal1": contract_addr['usd_decimal'],
      "pair": contract_addr["pair"],
    }) 

    const [liquidAmount, setLiquidAmount] = useState({
        "amount0": 0,
        "amount1": 0
    })

    const [balanceInfo, setBalanceInfo] = useState({
      "balance0": 0,
      "balance1": 0,
      "allowance0": 0,
      "allowance1": 0
    })

    // HAndle when user reconnect 
    useEffect(() => {
      if (connectedWallet) {
         const fetching = async () => {
            let balance0 = sca.balanceOf(connectedWallet.walletAddress);
            let balance1 = usd.balanceOf(connectedWallet.walletAddress);
            let allowance1 = sca.allowance(connectedWallet.walletAddress, tokenAddr.pair);
            let allowance2 = usd.allowance(connectedWallet.walletAddress, tokenAddr.pair);

            Promise.all([balance0, balance1, allowance1, allowance2]).then((values)=> {
              setBalanceInfo((prevState)=>({
                ...prevState,
                "balance0": parseInt(values[0].balance),
                "balance1": parseInt(values[1].balance),
                "allowance0": parseInt(values[2].allowance),
                "allowance1": parseInt(values[3].allowance)
              }))
            })
         }
        fetching()

        
      } else {
      }
    }, [connectedWallet, lcd, tokenAddr]);

   
    //todo: it is being called many time -> being delayed. Handle this issue
    //todo: considering using memo for pair class
    const handleParam =  () => async (e: { target: { name: any; value: any; }; }) => {
        const name = e.target.name;
        const value = e.target.value * 10 ** 6; //todo: using bignumber here

        // let reserves = await pair.get_reserves();
        
        // //change parameter according to reserve 
        // if (parseFloat(reserves.reserve0) != 0 && parseFloat(reserves.reserve1) != 0){

        // }

        setLiquidAmount((prevState) => ({
            ...prevState,
            [name]: value
          }));
        console.log(liquidAmount)
      };
    
    

    const approveTokens= useCallback(async()=>{
      if (!connectedWallet) {
        return;
      }

      sca.increaseAllowance(connectedWallet, tokenAddr.pair, liquidAmount.amount0.toString()).then((result:TxResult)=>{
        setBalanceInfo((prevState)=>({
          ...prevState,
          "allowance0": prevState.allowance0 + liquidAmount.amount0 
        }))
        console.log(result);
      }).catch((error:any)=>{alert(error.message)})

      usd.increaseAllowance(connectedWallet, tokenAddr.pair, liquidAmount.amount1.toString()).then((result:TxResult)=>{
        setBalanceInfo((prevState)=>({
          ...prevState,
          "allowance1": prevState.allowance1 + liquidAmount.amount1 
        }))

        console.log(result);
      }).catch((error:any)=>{alert(error.message)})

      

    },[connectedWallet, liquidAmount, tokenAddr])

    const addLiquid = useCallback(async() => {
        console.log("re-render")
        if (!connectedWallet) {
          return;
        }
        console.log(liquidAmount)
        if (liquidAmount.amount0 == 0 || liquidAmount.amount1 == 0){
          alert("Invalid amount");
          return;
        }

        pair.add_liquid(connectedWallet, liquidAmount.amount0.toString(), liquidAmount.amount1.toString()).then((result:TxResult)=> {
          console.log(result);
        }).catch((error:any)=>{
          alert(error.message);
        })
      }, [connectedWallet, liquidAmount, tokenAddr]);
    
  
    return (
      <div className='relative flex flex-wrap items-center justify-between px-2 py-3 mb-3'>
        
        <div className="container px-4  py-4 mx-auto flex items-center flex-col w-[50%] bg-slate-300">
          <div className="trade-header flex items-center">
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
          <div className="trade-content my-5 flex flex-row justify-center w-[80%] bg-slate-50">
            <div className="trade-board  w-[50%]">
              <div className="form-block my-2">
                    Add liquidity
              </div>
            
              <div className="add-liquid-for w-full">
                  <div>
                      <div className='my-4'>
                        <div className='token-info flex justify-between items-center w-full'>  
                            <div>GOLD</div>
                            <div> Balance: {balanceInfo.balance0 / (10 ** tokenAddr.decimal0)}</div>
                          </div>
                        <input
                            type="number"
                            name="amount0"
                            step="0.01"
                            required
                            placeholder="Name"
                            className="form-control"
                            value={liquidAmount.amount0 / (10**6)}
                            onChange={handleParam()}
                        />
                      </div>
                      <div className='my-4 w-full'>
                        <div className='token-info flex justify-between items-center w-full'>  
                          <div>USD</div>
                          <div> Balance: {balanceInfo.balance1 / (10 ** tokenAddr.decimal1)}</div>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            name="amount1"
                            required
                            placeholder="Email"
                            className="form-control"
                            value={liquidAmount.amount1 /(10**6)}
                            onChange={handleParam()}
                        />
                      </div>
                      
                      {liquidAmount.amount0 > balanceInfo.balance0 || liquidAmount.amount1 > balanceInfo.balance1 || liquidAmount.amount0 == 0 || liquidAmount.amount1 == 0 ? 
                       <button type="submit" className="px-8 py-3 text-white bg-gray-300 rounded focus:outline-none w-full" disabled>
                          Insufficent Balance
                      </button> 
                      : liquidAmount.amount0 > balanceInfo.allowance0 || liquidAmount.amount1 > balanceInfo.allowance1 ?
                      <button onClick={approveTokens} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full">
                        Approve
                      </button>
                       :<button onClick={addLiquid} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                        Add Liquidity
                     </button>}
                  </div>
              </div>

          
            </div>
           
           </div>
        </div>
      </div>
    );
}