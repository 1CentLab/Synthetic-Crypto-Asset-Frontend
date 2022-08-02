import React, { FC } from 'react';
import Link from 'next/link';
import Connecter from '../Wallet/Connecter';

// interface TitleProps {
//   title: string;
// }

const Nav = () => {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="app-header relative flex flex-wrap items-center justify-between px-2 py-3 mb-3">
        <div className="px-4 w-full flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link href="/">
              <a className="flex items-center text-base font-bold leading-relaxed mr-4 py-2 whitespace-nowrap uppercase ">
                <img
                  src="https://openseauserdata.com/files/d8217cc34fb75ed3acc0bc6a0aff7092.gif"
                  alt="logo"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
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
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto items-center">
              <li className="nav-item px-4">
                <Link href="/trade/swap">
                  <a className="text-base flex items-center uppercase font-bold leading-snug  hover:opacity-75">
                    <span className="ml-2">Trade</span>
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
      </nav>
    </>
  );
};

export default Nav;
