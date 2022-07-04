import { TxResult, useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import React, { useEffect, useState,useCallback } from 'react';
import Pair from '../../../connecter/pair';
import CW20 from '../../../connecter/token';
const contract_addr = require("../../../data/contracts.json");

const useTrade=()=>{
    const lcd = useLCDClient();
    const connectedWallet = useConnectedWallet();

    let pair = new Pair(lcd, contract_addr['pair']);
      let sca = new CW20(lcd, contract_addr['sca']);
      let usd = new CW20(lcd, contract_addr['usd']);

      
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
        
    return {
            balanceInfo,tokenAddr,handleParam,liquidAmount,addLiquid,approveTokens
        }
}
export default useTrade