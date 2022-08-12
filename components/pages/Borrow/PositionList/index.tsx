import { Statistic, Table } from 'antd';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import usePosition from '../../../../hooks/usePosition';
import useToken from '../../../../hooks/useToken';
import { toastSucces } from '../../../../utils';
import ClosePositionModal from '../../../ClosePositionModal';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
// @ts-nocheck;
const { Countdown } = Statistic;
const STATUS = {
  INCREASE: 'increase',
  EQUAL: 'equal',
  DECREASE: 'decrease',
};
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

const compare = (oldValue: any, newValue: any) => {
  console.log(oldValue, newValue, 'oldValue, newValue');
  if (!oldValue || !newValue) {
    return STATUS.EQUAL;
  }
  if (new BigNumber(oldValue).isEqualTo(newValue)) {
    return STATUS.EQUAL;
  }
  if (new BigNumber(oldValue).isLessThan(newValue)) {
    return STATUS.INCREASE;
  }
  return STATUS.DECREASE;
};

const renderICon = (status: any) => {
  console.log(status, 'renderICon');

  switch (status) {
    case STATUS.EQUAL:
      return <></>;
    case STATUS.DECREASE:
      return <ArrowDownOutlined />;
    case STATUS.INCREASE:
      return <ArrowUpOutlined />;
    default:
      return <></>;
  }
};

const pickColor = (status: any): string => {
  switch (status) {
    case STATUS.EQUAL:
      return 'black';
    case STATUS.DECREASE:
      return '#cf1322';
    case STATUS.INCREASE:
      return '#3f8600';
    default:
      return 'black';
  }
};

const PositionList = (props: Props) => {
  const [isVisibleModal, setIsVisible] = useState(false);

  const showModal = () => {
    setIsVisible(true);
  };

  const handleOk = () => {
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
    console.log('closeModal');
  };
  const columnsInit = [
    {
      title: (
        <div>
          Entry price
          <br />
          <label className="font-normal">(USD)</label>
        </div>
      ),
      dataIndex: DATA_INDEX.ENTRY_PRICE,
      key: '1',
      align: 'center',
    },
    {
      title: (
        <div>
          Initial Collateral amount
          <br />
          <label className="font-normal">(sUSD)</label>
        </div>
      ),
      dataIndex: DATA_INDEX.INITIAL_COLLATERAL_AMOUT,
      key: '2',
      align: 'center',
    },
    {
      title: (
        <div>
          Inital debt
          <br />
          <label className="font-normal">(sGold)</label>
        </div>
      ),
      dataIndex: DATA_INDEX.INIT_DEB,
      key: '3',
      align: 'center',
    },
    {
      title: (
        <div>
          Current price of GOLD
          <br />
          <label className="font-normal">(USD)</label>
        </div>
      ),
      dataIndex: DATA_INDEX.GOLD_PRICE,
      key: '4',
      align: 'center',
    },
    {
      title: (
        <div>
          Collateral amount
          <br />
          <label className="font-normal">(sUSD)</label>
        </div>
      ),
      dataIndex: DATA_INDEX.COLLATERAL_AMOUT,
      key: '5',
      align: 'center',
      render: (value: any, col: any) => {
        return (
          value && (
            <Statistic
              value={value}
              precision={2}
              valueStyle={{ color: pickColor(col[1]), fontSize: 14 }}
              prefix={renderICon(col[1])}
            />
          )
        );
      },
    },
    {
      title: (
        <div>
          Current debt
          <br />
          <label className="font-normal">(sGold)</label>
        </div>
      ),
      dataIndex: DATA_INDEX.DEBT,
      key: '6',
      align: 'center',
      render: (value: any, col: any) => {
        console.log(col, 'col');
        return (
          value && (
            <Statistic
              value={value}
              precision={2}
              valueStyle={{ color: pickColor(col[2]), fontSize: 14 }}
              prefix={renderICon(col[2])}
            />
          )
        );
      },
    },
    {
      title: 'Collateral ratio',
      dataIndex: DATA_INDEX.COLLATERAL_RATIO,
      key: '7',
      align: 'center',
      render: (value: any, col: any) => {
        console.log(col, 'col');
        return (
          value && (
            <Statistic
              value={value}
              precision={2}
              valueStyle={{ color: pickColor(col[3]), fontSize: 14 }}
              prefix={renderICon(col[3])}
              suffix="%"
            />
          )
        );
      },
    },

    {
      title: '',
      key: 'operation',
      align: 'center',
      width: '15%',
      render: () => (
        <button className="text-center" onClick={showModal}>
          <span className="font-bold text-[#b20000] opacity-70">Close position</span>
        </button>
      ),
    },
  ];
  const [dataSource, setDataSource] = useState(DATA_SOURCE) as any;
  const [isVisiblePosition, setIsVisiblePosition] = useState(true);
  const [columns, setColumns] = useState(columnsInit);
  const position = usePosition({});
  const goldPrice = useToken({});

  useEffect(() => {
    if (!_.isEmpty(position)) {
      const { size = '0', debt = '0', is_liquidated, initial_size } = position as any;
      if (size === '0') {
        setIsVisiblePosition(false);
        return;
      }
      const collateralRation = is_liquidated
        ? '0'
        : new BigNumber(size).div(new BigNumber(debt).multipliedBy(goldPrice)).multipliedBy(100).toFixed(2).toString();
      console.log(dataSource, 'dataSource');
      setDataSource([
        {
          ...position,
          [DATA_INDEX.GOLD_PRICE]: goldPrice,
          [DATA_INDEX.COLLATERAL_RATIO]: `${collateralRation}`,
          1: compare(dataSource[0]?.initial_size, initial_size),
          2: compare(dataSource[0]?.debt, debt),
          3: compare(dataSource[0]?.COLLATERAL_RATIO, collateralRation),
        },
      ]);
      setIsVisiblePosition(true);
    }
  }, [position, goldPrice]);

  return (
    <>
      {isVisiblePosition && (
        <>
          {' '}
          <h1 className="mb-4 text-xl font-bold text-[#42b883]">Positions</h1>
          <Table dataSource={dataSource} columns={columns as any} pagination={false} bordered></Table>
          {/* <Countdown value={(position && (position as any)?.countDown) || 0}></Countdown> */}
        </>
      )}

      <ClosePositionModal footer={false} visible={isVisibleModal} onCancel={handleCancel} position={position} />
    </>
  );
};

export default PositionList;
