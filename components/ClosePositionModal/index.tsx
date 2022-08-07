import { LCDClient } from '@terra-money/terra.js';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { Button, Modal } from 'antd';
import BigNumber from 'bignumber.js';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { CONTROLLER_CONTRACT_ADDR, MINT_CONTRACT_ADDR, SCA_CONTRACT_ADDR } from '../../common/constant';
import CONTROLLER from '../../connecter/controller';
import Mint from '../../connecter/mint';
import CW20 from '../../connecter/token';
import { useBalance } from '../../hooks/useBalance';
import useSystemDebt from '../../hooks/useSystemDebt';
import { LoadingContext } from '../../pages/_app';
import { buyFlowStep, STATUS_BALANCE } from '../../utils';

type Props = {};

function ClosePositionModal(props: any) {
  const { visible, onOk, onCancel, position } = props;
  const { sca = '', usd = '', scaAllowed = '', usdAllowed = '' } = useBalance({ contractAllowcen: MINT_CONTRACT_ADDR });
  const [buyFlow, setBuyFlow] = useState(STATUS_BALANCE.InsufficentBalance);
  const { setIsLoading } = useContext(LoadingContext) as any;
  const connectedWallet = useConnectedWallet();
  const lcd = useLCDClient();
  const approve = async (valueMain: string) => {
    if (connectedWallet) {
      setIsLoading(true);
      try {
        const SCA = new CW20(lcd, SCA_CONTRACT_ADDR);
        await SCA.increaseAllowance(connectedWallet, MINT_CONTRACT_ADDR, valueMain);
        setBuyFlow(STATUS_BALANCE.SUBMIT);
        alert('success');
      } catch (error) {
        console.log('error', error);
        alert('fail');
      } finally {
        setIsLoading(false);
      }
    }
  };
  const buyAuction = async (valueMain: string) => {
    if (connectedWallet) {
      setIsLoading(true);
      try {
        const mint = new Mint(lcd);
        await mint.close_position(connectedWallet, valueMain);
        alert('success');
      } catch (error) {
        console.log(error);
        alert('fail');
      } finally {
        setIsLoading(false);
      }
    }
  };
  const onSubmit = (data: any) => {
    const { valueMain } = data;
    try {
      if (buyFlow === STATUS_BALANCE.Approve) {
        approve(valueMain);
      }
      if (buyFlow === STATUS_BALANCE.SUBMIT) {
        buyAuction(valueMain);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title={<p style={{ color: '#286346', fontSize: 24 }}>Close Position</p>}
      footer={false}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Formik
        initialValues={{
          valueMain: '0',
        }}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <div className="form-component w-100 mr-5 h-full" style={{ backgroundColor: 'white', border: 'none' }}>
                <div className="bg-white rounded-3xl ">
                  <div className="form-main px-6 h-full">
                    <div className="form-item flex flex-col">
                      <div className="text-lg font-medium flex items-center justify-between">
                        <div className="text-md">Amount</div>
                        <div className="opacity-60 text-sm">Balance: {sca}</div>
                      </div>
                      <div className="input-wrapper flex justify-between items-center">
                        <Field
                          type="text "
                          id="valueMain"
                          name="valueMain"
                          placeholder="0.00"
                          onChange={(e: any) => {
                            const { value, name } = e.target;
                            setFieldValue(name, value);
                            const step = buyFlowStep(value, sca, scaAllowed);
                            setBuyFlow(step);
                          }}
                        />
                        <p
                          className="flex mr-4 hover:cursor-pointer opacity-50 font-bold text-[#286346]"
                          onClick={() => {
                            setFieldValue('valueMain', position?.debt);
                            const step = buyFlowStep(position?.debt, sca, scaAllowed);
                            setBuyFlow(step);
                          }}
                        >
                          Max
                        </p>
                      </div>
                    </div>{' '}
                    <div className="opacity-90 text-sm mt-2">
                      System deb:{' '}
                      <span className="opacity-100" style={{ color: 'red ' }}>
                        {position?.debt}
                      </span>
                    </div>
                    <Button className="button-submit" htmlType="submit" type="primary">
                      {buyFlow}
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default ClosePositionModal;
