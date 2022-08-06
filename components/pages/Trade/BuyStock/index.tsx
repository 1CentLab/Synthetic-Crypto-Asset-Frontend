import { Button, Col, Divider, Row } from 'antd';
import BigNumber from 'bignumber.js';
import { Field, Form, Formik, FormikProps } from 'formik';
import React, { useRef, useState } from 'react';
import { PAIR_CONTRACT_ADDR, SCA_CONTRACT_ADDR, USD_CONTRACT_ADDR } from '../../../../common/constant';
import Pair from '../../../../connecter/pair';
import CW20 from '../../../../connecter/token';
import { useBalance } from '../../../../hooks/useBalance';
import useTrade from '../../../../pages/trade/hooks/useTrade';
import { SwapOutlined } from '@ant-design/icons';
type Props = {};
const exchangeRate = '0.2';
function BuyStock({}: Props) {
  const formikRef = useRef<FormikProps<any>>(null);
  const { sca = '', usd = '', scaAllowed = '', usdAllowed = '' } = useBalance(PAIR_CONTRACT_ADDR);
  const [direction, setDirection] = useState({ main: USD_CONTRACT_ADDR, second: SCA_CONTRACT_ADDR });

  const exchangeRateDirection =
    direction?.main === USD_CONTRACT_ADDR ? exchangeRate : new BigNumber(1).dividedBy(exchangeRate).toString();

  const isNeedApprove = () => {
    return new BigNumber(sca);
  };

  const onSubmit = (data: any) => {
    console.log(data);
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
