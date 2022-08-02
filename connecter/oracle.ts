import { LCDClient, MsgExecuteContract } from '@terra-money/terra.js';
import { ConnectedWallet } from '@terra-money/wallet-types';
import BigNumber from 'bignumber.js';
import { ORACLE_CONTRACT_ADDR, SCA_CONTRACT_ADDR } from '../common/constant';

class ORACLE {
  lcd: LCDClient;
  address: string;
  constructor(lcd: LCDClient) {
    this.lcd = lcd;
    this.address = ORACLE_CONTRACT_ADDR;
  }

  // Query
  async get_price() {
    console.log(this.address, SCA_CONTRACT_ADDR);

    let result = await this.lcd.wasm.contractQuery(this.address, {
      get_price: {
        sca: SCA_CONTRACT_ADDR,
      },
    });

    return result;
  }
}

export default ORACLE;
