import { Button, Col, Divider, Row, Tooltip } from 'antd';
import BigNumber from 'bignumber.js';
import { Field, Form, Formik, FormikProps } from 'formik';
import React, { useContext, useRef, useState } from 'react';
import { SwapOutlined } from '@ant-design/icons';
import { useBalance } from '../../hooks/useBalance';
import {
  CONTROLLER_CONTRACT_ADDR,
  MINT_CONTRACT_ADDR,
  SCA_CONTRACT_ADDR,
  USD_CONTRACT_ADDR,
} from '../../common/constant';
import SliderBase from '../../components/SliderBase';
import { useConnectedWallet, useLCDClient, useWallet } from '@terra-money/wallet-provider';
import Mint from '../../connecter/mint';
import CW20 from '../../connecter/token';
import { get } from 'lodash';
import { LoadingContext } from '../_app';
import { SliderMarks } from 'antd/lib/slider';
type Props = {};
const exchangeRate = '0.2';
const marks: SliderMarks = {
  500: {
    style: {
      background: 'red',
    },
  },
};
function BuyStock({}: Props) {
  const {
    sca = '',
    usd = '',
    scaAllowed = '',
    usdAllowed = '',
  } = useBalance({ contractAllowcen: CONTROLLER_CONTRACT_ADDR });
  const [direction, setDirection] = useState({ main: USD_CONTRACT_ADDR, second: SCA_CONTRACT_ADDR });
  const connectedWallet = useConnectedWallet();
  const { setIsLoading } = useContext(LoadingContext) as any;
  const lcd = useLCDClient();
  const exchangeRateDirection =
    direction?.main === USD_CONTRACT_ADDR ? exchangeRate : new BigNumber(1).dividedBy(exchangeRate).toString();

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const { valueMain, ratio } = data;

      const approve = new CW20(lcd, direction.main);
      const mint = new Mint(lcd);
      if (!connectedWallet) {
        return;
      }
      const result = await approve.increaseAllowance(connectedWallet, MINT_CONTRACT_ADDR, valueMain);
      const resultMint = await mint.open_position(connectedWallet, valueMain, ratio);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="buy-stock-component flex justify-center">
      <Formik
        initialValues={{
          valueMain: '0',
          ratio: 0,
        }}
        onSubmit={onSubmit}
      >
        {(props) => {
          const { setFieldValue, values } = props;
          return (
            <Form className="flex w-full justify-center">
              {' '}
              <div className="form-component w-100 mr-5">
                <div className="bg-white rounded-3xl ">
                  <div className="px-6 pt-6">
                    <h2 className="text-xl font-bold">Borrow</h2>
                    <p className="">Borrow newly minted uStocks by providing EURB as collateral and open a position</p>
                  </div>
                  <Divider />
                  <div className="form-main px-6">
                    <div className="form-item flex flex-col">
                      <label className="text-lg font-medium" htmlFor="valueMain">
                        {direction.main === USD_CONTRACT_ADDR ? 'USD' : 'SCA'}
                      </label>
                      <div className="input-wrapper">
                        <Field
                          type="text "
                          id="valueMain"
                          name="valueMain"
                          placeholder="0.00"
                          onChange={(e: any) => {
                            const { value, name } = e.target;
                            const reg = new RegExp(/^-?\d+\.?\d*$/);
                            console.log(value);
                            if (reg.test(value)) {
                              setFieldValue(name, value);

                              setFieldValue(
                                'valueSecond',
                                new BigNumber(value).multipliedBy(exchangeRateDirection).toString()
                              );
                            } else {
                              setFieldValue(name, value.slice(0, -1));
                              !value && setFieldValue('valueSecond', '');
                            }
                          }}
                        />
                      </div>
                    </div>{' '}
                    <div className="form-item mt-5">
                      <label className="text-lg font-medium" htmlFor="valueSecond">
                        {direction.second === SCA_CONTRACT_ADDR ? 'SCA' : 'USD'}
                      </label>
                      <div className="input-wrapper">
                        {' '}
                        <Field
                          type="text"
                          id="valueSecond"
                          name="valueSecond"
                          placeholder="0.00"
                          className="form-item"
                          disabled
                          onChange={(e: any) => {
                            const { value, name } = e.target;
                            const reg = new RegExp(/^-?\d+\.?\d*$/);
                            if (reg.test(value)) {
                              setFieldValue(name, value);
                              setFieldValue(
                                'valueMain',
                                new BigNumber(value).dividedBy(exchangeRateDirection).toString()
                              );
                            } else {
                              setFieldValue(name, value.slice(0, -1));
                              !value && setFieldValue('valueMain', '');
                            }
                          }}
                        />
                      </div>
                    </div>
                    <Button className="button-submit" htmlType="submit" type="primary">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>{' '}
              <div className="form-component w-3/12 ml-5">
                <div className="bg-white rounded-3xl h-full">
                  <div className="px-6 pt-6">
                    <h2 className="text-xl font-bold">Set a Collateral Ratio</h2>
                    <p className="">Position will be liquidated below the minimum. </p>
                    <div className="my-10">
                      <SliderBase
                        tooltipVisible={true}
                        marks={marks}
                        name="ratio"
                        setFieldValue={setFieldValue}
                      ></SliderBase>
                    </div>
                    <div>
                      <Tooltip title="150%" placement="left" visible={true}>
                        <p className="text-xs ml-16">
                          {' '}
                          Minimum collateral ratio. When the position drops below this value, any user may immediately
                          liquidate the position.
                        </p>
                      </Tooltip>
                      <Tooltip title="200%" placement="left" visible={true}>
                        <p className="text-xs ml-16 mt-10">
                          {' '}
                          (Minimum collateral ratio) + 50%. Safe from market fluctuations. Hard to get liquidated by
                          other users.
                        </p>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default BuyStock;
