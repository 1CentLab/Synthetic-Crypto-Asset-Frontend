import { Tabs } from 'antd';
import React from 'react';
import BuyStock from './BuyStock';
import Liquidity from './Liquidity';

type Props = {};
const { TabPane } = Tabs;
function TradeComponent({}: Props) {
  return (
    <div className="trade-component" style={{ height: '85vh' }}>
      <div className="trade-wrapper container">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Swap" key="1">
            <BuyStock></BuyStock>
          </TabPane>
          <TabPane tab="Liquidity" key="2">
            <Liquidity />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default TradeComponent;
