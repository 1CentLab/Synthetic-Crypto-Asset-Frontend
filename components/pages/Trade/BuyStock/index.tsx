import { Button, Col, Divider, Row } from 'antd';
import BigNumber from 'bignumber.js';
import { Field, Form, Formik, FormikProps } from 'formik';
import React, { useContext, useRef, useState } from 'react';
import {
  MINT_CONTRACT_ADDR,
  PAIR_CONTRACT_ADDR,
  SCA_CONTRACT_ADDR,
  USD_CONTRACT_ADDR,
} from '../../../../common/constant';
import Pair from '../../../../connecter/pair';
import CW20 from '../../../../connecter/token';
import { useBalance } from '../../../../hooks/useBalance';
import useTrade from '../../../../pages/trade/hooks/useTrade';
import { SwapOutlined } from '@ant-design/icons';
import useToken from '../../../../hooks/useToken';
import useReserve from '../../../../hooks/useReserve';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { LoadingContext } from '../../../../pages/_app';
import { toastFail, toastSucces } from '../../../../utils';
import { sleep } from '../../Borrow';
type Props = {};

function BuyStock({}: Props) {
  const formikRef = useRef<FormikProps<any>>(null);
  const { sca = '', usd = '', scaAllowed = '', usdAllowed = '' } = useBalance({ contractAllowcen: PAIR_CONTRACT_ADDR });
  const exchangeRate = useReserve({});

  const { setIsLoading } = useContext(LoadingContext) as any;
  const connectedWallet = useConnectedWallet();
  const lcd = useLCDClient();
  const [direction, setDirection] = useState({ main: USD_CONTRACT_ADDR, second: SCA_CONTRACT_ADDR });
  const exchangeRateDirection =
    direction?.main === USD_CONTRACT_ADDR ? exchangeRate : new BigNumber(1).dividedBy(exchangeRate).toString();

  const isNeedApprove = () => {
    return new BigNumber(sca);
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    setIsLoading(true);
    try {
      const { valueMain, ratio } = data;

      const approve = new CW20(lcd, direction.main);
      const pair = new Pair(lcd, PAIR_CONTRACT_ADDR);
      if (!connectedWallet) {
        return;
      }
      const result = await approve.increaseAllowance(connectedWallet, PAIR_CONTRACT_ADDR, valueMain);
      await sleep(2000);
      const resultSwap = await pair.swap(connectedWallet, valueMain, direction.main, direction.second);
      console.log(resultSwap, 'resultSwap');
      setIsLoading(false);

      toastSucces();
    } catch (error) {
      toastFail;
      console.log(error, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="buy-stock-component flex ">
      <div className="form-component w-80 mx-auto">
        <div className="bg-white rounded-3xl ">
          <div className="px-6 pt-6">
            <h2 className="text-xl text-center font-bold">Swap</h2>
            <p className="text-center">Trade tokens in an instant</p>
          </div>
          <Divider />
          <div className="form-main px-6">
            <Formik
              initialValues={{
                valueMain: '0',
                valueSecond: '0',
              }}
              onSubmit={onSubmit}
            >
              {(props) => {
                const { setFieldValue, values } = props;
                return (
                  <Form>
                    <div className="form-item flex flex-col">
                      <div className="text-lg font-medium flex items-center justify-between">
                        <div> {direction.main === USD_CONTRACT_ADDR ? 'sUSD' : 'sGOLD'}</div>
                        <div className="text-xs">
                          <div>
                            Balance:
                            {direction.main === USD_CONTRACT_ADDR ? usd : sca}
                          </div>
                        </div>
                      </div>
                      <div className="input-wrapper">
                        <Field
                          type="text "
                          id="valueMain"
                          name="valueMain"
                          placeholder="0.00"
                          onChange={(e: any) => {
                            const { value, name } = e.target;
                            const reg = new RegExp(/^-?\d+\.?\d*$/);

                            if (reg.test(value)) {
                              setFieldValue(name, value);

                              setFieldValue(
                                'valueSecond',
                                new BigNumber(value).multipliedBy(exchangeRateDirection).decimalPlaces(6).toString()
                              );
                            } else {
                              setFieldValue(name, value.slice(0, -1));
                              !value && setFieldValue('valueSecond', '');
                            }
                          }}
                        />
                      </div>
                    </div>{' '}
                    <button
                      type="button"
                      className="button-swap"
                      onClick={() => {
                        setDirection({ ...direction, main: direction.second, second: direction.main });
                        setFieldValue('valueMain', values['valueSecond']);
                        setFieldValue('valueSecond', values['valueMain']);
                      }}
                    >
                      <SwapOutlined />{' '}
                    </button>
                    <div className="form-item">
                      <div className="text-lg font-medium flex items-center justify-between">
                        {direction.second === SCA_CONTRACT_ADDR ? 'sSCA' : 'sUSD'}{' '}
                        <div className="text-xs">
                          <div>
                            Balance:
                            {direction.second === USD_CONTRACT_ADDR ? usd : sca}
                          </div>
                        </div>
                      </div>

                      <div className="input-wrapper">
                        {' '}
                        <Field
                          type="text"
                          id="valueSecond"
                          name="valueSecond"
                          placeholder="0.00"
                          className="form-item"
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
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyStock;
