import { Button, Modal, Spin } from 'antd';
import React, { useContext, useState } from 'react';
import { LoadingContext } from '../../pages/_app';
import { LoadingOutlined } from '@ant-design/icons';
const ModalLoading: React.FC = () => {
  const { isLoading, setIsLoading } = useContext(LoadingContext) as any;
  console.log('isLoading', isLoading);
  return (
    <>
      <Modal footer={null} visible={isLoading} closable={false}>
        <div className="flex justify-center h-80 w-full items-center ">
          <Spin size="large" />
        </div>
      </Modal>
    </>
  );
};

export default ModalLoading;
