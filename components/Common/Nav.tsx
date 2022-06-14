import React, { FC } from 'react';
import Link from "next/link";
import Connecter from "../Wallet/Connecter";

// interface TitleProps {
//   title: string;
// }

const Nav = () => {
  return (
    
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ height: "80px", width: "100vw", padding: "20px", backgroundColor: "white"}}
      >
        <h2> Synthetic Crypto Assets</h2>
        <Connecter/>
      </div>
    
  );
};

export default Nav;