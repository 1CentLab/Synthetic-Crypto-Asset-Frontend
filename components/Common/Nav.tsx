import React, { FC } from 'react';
import Link from "next/link";
import Connecter from "../Wallet/Connecter";

// interface TitleProps {
//   title: string;
// }

const Nav = () => {
  const [navbarOpen, setNavbarOpen] = React.useState(false)
  return (
    
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 mb-3 bg-sky-700">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link href="/">
              <a
                className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              >
                Synthetic Crypto Assets
              </a>
            </Link>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <p> Setting </p>
              <i className="fas fa-bars"></i>
            </button>
          </div>

          
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <Link href="/trade/swap">
                  <a
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  >
                    <span className="ml-2">Trade</span>
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/borrow">
                <a
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                >
                 <span className="ml-2">Borrow</span>
                </a>
                </Link>
              </li>
    
              <li className="nav-item">
                  <span className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 ml-2"><Connecter></Connecter></span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;