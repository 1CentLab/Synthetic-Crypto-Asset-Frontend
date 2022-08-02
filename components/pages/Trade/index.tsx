import { Tabs } from 'antd';
import React from 'react';
import BuyStock from './BuyStock';

type Props = {};
const { TabPane } = Tabs;
function TradeComponent({}: Props) {
  return (
    <div className="trade-component h-screen bg-sky-100">
      <div className="trade-wrapper container">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Swap" key="1">
            <BuyStock></BuyStock>
          </TabPane>
          <TabPane tab="Limit" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Liquidity" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default TradeComponent;
