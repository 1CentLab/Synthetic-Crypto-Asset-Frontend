import { Button } from 'antd';
import BigNumber from 'bignumber.js';
import { Field, Form, Formik, FormikProps } from 'formik';
import React, { useRef, useState } from 'react';
import { SCA_CONTRACT_ADDR, USD_CONTRACT_ADDR } from '../../../../common/constant';
import Pair from '../../../../connecter/pair';
import CW20 from '../../../../connecter/token';
import { useBalance } from '../../../../hooks/useBalance';
import useTrade from '../../../../pages/trade/hooks/useTrade';

type Props = {};
const exchangeRate = '0.2';
function BuyStock({}: Props) {
  const formikRef = useRef<FormikProps<any>>(null);
  const { sca = '', usd = '', scaAllowed = '', usdAllowed = '' } = useBalance();
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
    <div className="buy-stock-component">
      <h3>
        Use EURB to trade for uStocks. Tradings are made against the asset’s Uniswap pool and price algorithmically
      </h3>
      <div className="form-wrapper">
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
                <div>
                  <label htmlFor="valueMain">{direction.main === USD_CONTRACT_ADDR ? 'USD' : 'SCA'}</label>
                  <Field
                    type="text"
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
                </div>{' '}
                <button
                  type="button"
                  onClick={() => {
                    setDirection({ ...direction, main: direction.second, second: direction.main });
                    setFieldValue('valueMain', values['valueSecond']);
                    setFieldValue('valueSecond', values['valueMain']);
                  }}
                >
                  change direction
                </button>
                <div>
                  <label htmlFor="valueSecond">{direction.second === SCA_CONTRACT_ADDR ? 'SCA' : 'USD'}</label>
                  <Field
                    type="text"
                    id="valueSecond"
                    name="valueSecond"
                    placeholder="0.00"
                    onChange={(e: any) => {
                      const { value, name } = e.target;
                      const reg = new RegExp(/^-?\d+\.?\d*$/);
                      if (reg.test(value)) {
                        setFieldValue(name, value);
                        setFieldValue('valueMain', new BigNumber(value).dividedBy(exchangeRateDirection).toString());
                      } else {
                        setFieldValue(name, value.slice(0, -1));
                        !value && setFieldValue('valueMain', '');
                      }
                    }}
                  />
                </div>
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default BuyStock;
