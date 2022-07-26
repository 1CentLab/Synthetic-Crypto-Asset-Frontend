import { Tabs } from 'antd';
import React from 'react';
import BuyStock from './BuyStock';

type Props = {};
const { TabPane } = Tabs;
function TradeComponent({}: Props) {
  return (
    <div className="trade-component container">
      <div className="trade-wrapper">
        <Tabs defaultActiveKey="1">
          <TabPane tab="BuyUStock" key="1">
            <BuyStock></BuyStock>
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default TradeComponent;
