import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { Badge, Button, Card, Divider, Tooltip } from 'antd';
import BigNumber from 'bignumber.js';
import { Field, Formik, Form } from 'formik';
import React, { useContext, useState } from 'react';
import {
  CONTROLLER_CONTRACT_ADDR,
  MINT_CONTRACT_ADDR,
  SCA_CONTRACT_ADDR,
  USD_CONTRACT_ADDR,
} from '../../../common/constant';
import Mint from '../../../connecter/mint';
import CW20 from '../../../connecter/token';
import { useBalance } from '../../../hooks/useBalance';
import usePosition from '../../../hooks/usePosition';
import useToken from '../../../hooks/useToken';
import { LoadingContext } from '../../../pages/_app';
import SliderBase from '../../SliderBase';
import PositionList from './PositionList';

type Props = {};

function BorrowComponent({}: Props) {
  const { sca = '', usd = '', scaAllowed = '', usdAllowed = '' } = useBalance({ contractAllowcen: MINT_CONTRACT_ADDR });
  const exchangeRate = '0.2';
  const goldPrice = useToken({});

  const [direction, setDirection] = useState({ main: USD_CONTRACT_ADDR, second: SCA_CONTRACT_ADDR });
  const connectedWallet = useConnectedWallet();
  const { setIsLoading } = useContext(LoadingContext) as any;
  const lcd = useLCDClient();

  // const BUYFLOW =
  const onSubmit = async (data: any) => {
    console.log(data);
    setIsLoading(true);
    try {
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
    <div className="borrow-componet h-screen flex justify-center">
      <Formik
        initialValues={{
          valueMain: '0',
          valueSecond: '0',
          ratio: 200,
        }}
        onSubmit={onSubmit}
      >
        {(props) => {
          const { setFieldValue, values, errors } = props;
          console.log(errors);
          return (
            <div>
              {' '}
              <Form className="flex w-full justify-center">
                <div className="form-component w-100 mr-5 h-full">
                  <div className="bg-white rounded-3xl ">
                    <div className="px-6 pt-6">
                      <h2 className="text-xl font-bold">Borrow</h2>
                      <p className="">
                        Borrow newly minted uStocks by providing EURB as collateral and open a position
                      </p>
                    </div>
                    <Divider />
                    <div className="form-main px-6 h-full">
                      <div className="form-item flex flex-col">
                        <div className="text-lg font-medium flex items-center justify-between">
                          <div> {direction.main === USD_CONTRACT_ADDR ? 'USD' : 'GOLD'}</div>
                          <div className="text-xs">
                            <div>USD Balance:{usd}</div> <div>USD Allowed:{usdAllowed}</div>
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
                              console.log(values);
                              if (reg.test(value)) {
                                setFieldValue(name, value);

                                setFieldValue(
                                  'valueSecond',
                                  new BigNumber(value).div(goldPrice).div(values['ratio']).multipliedBy(100).toString()
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
                        <div className="text-lg font-medium flex items-center justify-between">
                          <div> {direction.second === SCA_CONTRACT_ADDR ? 'GOLD' : 'USD'}</div>
                          <div className="text-xs">
                            <div>GOLD Balance:{sca}</div> <div>GOLD Allowed:{scaAllowed}</div>
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
                            disabled
                          />
                        </div>
                      </div>
                      <Button className="button-submit" htmlType="submit" type="primary">
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="form-component w-4/12 ml-5">
                  <div className="bg-white rounded-3xl h-full">
                    <div className="px-6 pt-6">
                      <h2 className="text-xl font-bold">Set a Collateral Ratio</h2>
                      <p className="">Position will be liquidated below the minimum. </p>
                      <div className="my-10">
                        <SliderBase
                          name="ratio"
                          setFieldValue={setFieldValue}
                          values={values}
                          goldPrice={goldPrice}
                        ></SliderBase>
                      </div>
                      <div>
                        <div>
                          <div className="text-xs ">
                            <Badge.Ribbon text="150%">
                              <Card>
                                {' '}
                                Minimum collateral ratio. When the position drops below this value, any user may
                                immediately liquidate the position.
                              </Card>
                            </Badge.Ribbon>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs">
                            <Badge.Ribbon text="200%">
                              <Card>
                                (Minimum collateral ratio) + 50%. Safe from market fluctuations. Hard to get liquidated
                                by other users.
                              </Card>
                            </Badge.Ribbon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
              <div className="mx-auto container mt-10">
                <PositionList />
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}

export default BorrowComponent;
