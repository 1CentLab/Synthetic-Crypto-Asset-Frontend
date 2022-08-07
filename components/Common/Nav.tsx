import React, { FC, useState } from 'react';
import Link from 'next/link';
import Connecter from '../Wallet/Connecter';
import { Modal } from 'antd';
import AuctiionModal from '../AuctionModal';
import HeaderPrice from '../HeaderPrice';

// interface TitleProps {
//   title: string;
// }

const Nav = () => {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <nav className="app-header relative flex flex-wrap items-center justify-between px-2 py-3 mb-3 bg-slate-50 shadow-md">
        <div className="px-4 w-full flex flex-wrap items-center justify-between ">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link href="/">
              <a className="flex items-center text-base font-bold leading-relaxed mr-4 py-2 whitespace-nowrap uppercase ">
                <img src="/static/favicon.png" alt="logo" width={50} height={50} className="rounded-full mr-3" />
                Synthetic Crypto Assets
              </a>
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <p> Setting </p>
              <i className="fas fa-bars"></i>
            </button>
          </div>

          <div
            className={'lg:flex flex-grow items-center h-full' + (navbarOpen ? ' flex' : ' hidden')}
            id="example-navbar-danger"
          >
            <HeaderPrice />
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto items-center">
              <li className="nav-item px-4">
                <button
                  onClick={showModal}
                  className="text-base flex items-center uppercase font-bold leading-snug  hover:opacity-75"
                >
                  <span className="ml-2">Auction</span>
                </button>
              </li>
              <li className="nav-item px-4">
                <Link href="/swap">
                  <a className="text-base flex items-center uppercase font-bold leading-snug  hover:opacity-75">
                    <span className="ml-2">Swap</span>
                  </a>
                </Link>
              </li>
              <li className="nav-item px-4">
                <Link href="/borrow">
                  <a className="flex items-center text-base uppercase font-bold leading-snug  hover:opacity-75">
                    <span className="ml-2">Borrow</span>
                  </a>
                </Link>
              </li>

              <li className="nav-item px-4">
                <span className="flex items-center text-base uppercase font-bold leading-snug  hover:opacity-75 ml-2">
                  <Connecter></Connecter>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <AuctiionModal footer={false} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}></AuctiionModal>
      </nav>
    </>
  );
};

export default Nav;
