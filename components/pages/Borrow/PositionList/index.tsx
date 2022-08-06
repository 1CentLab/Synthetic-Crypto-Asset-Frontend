import { Table } from 'antd';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import usePosition from '../../../../hooks/usePosition';
import useToken from '../../../../hooks/useToken';

type Props = {};
export const DATA_INDEX = {
  ENTRY_PRICE: 'entry_price',
  INITIAL_COLLATERAL_AMOUT: 'initial_size',
  INIT_DEB: 'initial_debt',
  GOLD_PRICE: 'gold_price',
  COLLATERAL_AMOUT: 'size',
  DEBT: 'debt',
  COLLATERAL_RATIO: 'COLLATERAL_RATIO',
};

const DATA_SOURCE = [{}];

const columns = [
  {
    title: 'Entry price',
    dataIndex: DATA_INDEX.ENTRY_PRICE,
    key: '1',
    align: 'center',
  },
  {
    title: 'Initial Collateral amount',
    dataIndex: DATA_INDEX.INITIAL_COLLATERAL_AMOUT,
    key: '2',
    align: 'center',
  },
  {
    title: 'Inital debt',
    dataIndex: DATA_INDEX.INIT_DEB,
    key: '3',
    align: 'center',
  },
  {
    title: 'Current price of GOLD',
    dataIndex: DATA_INDEX.GOLD_PRICE,
    key: '4',
    align: 'center',
  },
  {
    title: 'Collateral amount',
    dataIndex: DATA_INDEX.COLLATERAL_AMOUT,
    key: '5',
    align: 'center',
  },
  {
    title: 'Current debt',
    dataIndex: DATA_INDEX.DEBT,
    key: '6',
    align: 'center',
  },
  {
    title: <div>Current debt</div>,
    dataIndex: DATA_INDEX.COLLATERAL_RATIO,
    key: '7',
    align: 'center',
  },
];

const PositionList = (props: Props) => {
  const [dataSource, setDataSource] = useState(DATA_SOURCE);
  const position = usePosition({});
  const goldPrice = useToken({});
  console.log(position, dataSource, 'thangphamposition');
  console.log(goldPrice, 'thangphangoldprice');
  useEffect(() => {
    if (!_.isEmpty(position)) {
      const { size = '0', debt = '0', is_liquidated } = position as any;
      const collateralRation = is_liquidated
        ? '0'
        : new BigNumber(size).div(new BigNumber(debt).multipliedBy(goldPrice)).multipliedBy(100).toFixed(2).toString();
      setDataSource([
        { ...position, [DATA_INDEX.GOLD_PRICE]: goldPrice, [DATA_INDEX.COLLATERAL_RATIO]: `${collateralRation} %` },
      ]);
    }
  }, [position, goldPrice]);

  console.log(dataSource, 'thangpham00000');
  return <Table dataSource={dataSource} columns={columns} pagination={false} bordered></Table>;
};

export default PositionList;
