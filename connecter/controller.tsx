import { LCDClient, MsgExecuteContract } from '@terra-money/terra.js';
import { ConnectedWallet } from '@terra-money/wallet-types';
import BigNumber from 'bignumber.js';
import {
  CONTROLLER_CONTRACT_ADDR,
  decimalScale,
  ORACLE_CONTRACT_ADDR,
  SCA_CONTRACT_ADDR,
  USD_CONTRACT_ADDR,
} from '../common/constant';

class CONTROLLER {
  lcd: LCDClient;
  address: string;
  constructor(lcd: LCDClient) {
    this.lcd = lcd;
    this.address = CONTROLLER_CONTRACT_ADDR;
  }

  // Query
  async get_asset_state() {
    let result = await this.lcd.wasm.contractQuery(this.address, {
      get_asset_state: {
        sca: SCA_CONTRACT_ADDR,
        collateral: USD_CONTRACT_ADDR,
      },
    });

    return result;
  }

  async buy_auction(connectedWallet: ConnectedWallet, amount: string) {
    console.log(amount);
    await connectedWallet.post({
      msgs: [
        new MsgExecuteContract(connectedWallet.walletAddress, this.address, {
          buy_auction: {
            sca: SCA_CONTRACT_ADDR,
            collateral: USD_CONTRACT_ADDR,
            sca_amount: new BigNumber(amount).multipliedBy(decimalScale).toString(),
          },
        }),
      ],
    });
  }
}

export default CONTROLLER;
