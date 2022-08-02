import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { Button, Dropdown, Menu } from 'antd';
import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { convertAddressToDisplayValue } from '../../utils';
export default function Connecter() {
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    availableInstallTypes,
    availableConnections,
    supportFeatures,

    connect,
    disconnect,
  } = useWallet();

  return (
    <div style={{ display: 'flex', padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' }}>
      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <>
          {/* {availableInstallTypes.map((connectType) => (
            <button
              key={'install-' + connectType}
              onClick={() => install(connectType)}
            >
              Install {connectType}
            </button>
          ))} */}
          {/* {availableConnectTypes.map((connectType) => (

            <button
              key={'connect-' + connectType}
              onClick={() => connect(connectType)}
            >
              Connect {connectType}
            </button>
          ))} */}
          <br />
          {availableConnections.map(
            ({ type, name, icon, identifier = '' }) => {
              return (
                identifier == 'station' && (
                  <Button
                    shape="round"
                    style={{
                      backgroundColor: 'rgb(31, 199, 212)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                    key={'connection-' + type + identifier}
                    onClick={() => connect(type, identifier)}
                  >
                    Connect Wallet
                  </Button>
                )
              );
            }

            // ),
          )}
        </>
      )}
      {status === WalletStatus.WALLET_CONNECTED && (
        <Dropdown
          overlay={
            <Menu
              items={[
                {
                  key: '1',
                  label: <button onClick={() => disconnect()}>Disconnect</button>,
                },
              ]}
            ></Menu>
          }
        >
          <Button
            shape="round"
            style={{
              backgroundColor: 'rgb(31, 199, 212)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {convertAddressToDisplayValue(wallets[0].terraAddress)}
          </Button>
        </Dropdown>
      )}
    </div>
  );
}
