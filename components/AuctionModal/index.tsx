import { LCDClient } from '@terra-money/terra.js';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { Button, Modal } from 'antd';
import BigNumber from 'bignumber.js';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { CONTROLLER_CONTRACT_ADDR, MINT_CONTRACT_ADDR, SCA_CONTRACT_ADDR } from '../../common/constant';
import CONTROLLER from '../../connecter/controller';
import CW20 from '../../connecter/token';
import { useBalance } from '../../hooks/useBalance';
import useSystemDebt from '../../hooks/useSystemDebt';
import { LoadingContext } from '../../pages/_app';
import { buyFlowStep, STATUS_BALANCE } from '../../utils';

type Props = {};

function AuctiionModal(props: any) {
  const { visible, onOk, onCancel } = props;
  const {
    sca = '',
    usd = '',
    scaAllowed = '',
    usdAllowed = '',
  } = useBalance({ contractAllowcen: CONTROLLER_CONTRACT_ADDR });
  const [buyFlow, setBuyFlow] = useState(STATUS_BALANCE.InsufficentBalance);
  const { setIsLoading } = useContext(LoadingContext) as any;
  const connectedWallet = useConnectedWallet();
  const lcd = useLCDClient();
  const approve = async (valueMain: string) => {
    if (connectedWallet) {
      setIsLoading(true);
      try {
        const SCA = new CW20(lcd, SCA_CONTRACT_ADDR);
        await SCA.increaseAllowance(connectedWallet, CONTROLLER_CONTRACT_ADDR, valueMain);
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
        const controller = new CONTROLLER(lcd);
        await controller.buy_auction(connectedWallet, valueMain);
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

  const { system_debt } = useSystemDebt({});
  return (
    <Modal title="Auction" footer={false} visible={visible} onOk={onOk} onCancel={onCancel}>
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
                        <div> Auction</div>
                        <div>
                          Balance:{sca}||{scaAllowed}
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
                            setFieldValue(name, value);
                            const step = buyFlowStep(value, sca, scaAllowed);
                            setBuyFlow(step);
                          }}
                        />
                      </div>
                    </div>{' '}
                    <div>System deb: {system_debt}</div>
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

export default AuctiionModal;
