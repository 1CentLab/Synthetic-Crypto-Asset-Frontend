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
import useTrade from '../hooks/useTrade';

export default function AddLiquid() {
   const {balanceInfo,tokenAddr,handleParam,liquidAmount,approveTokens,addLiquid}=useTrade()
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
              </div>lazy load input react
            
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