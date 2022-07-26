import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import React from 'react';

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
                  <button key={'connection-' + type + identifier} onClick={() => connect(type, identifier)}>
                    <img src={icon} alt={name} style={{ width: '1em', height: '1em' }} />
                    {name} [{identifier}]
                  </button>
                )
              );
            }

            // ),
          )}
        </>
      )}
      {status === WalletStatus.WALLET_CONNECTED && <button onClick={() => disconnect()}>Disconnect</button>}
    </div>
  );
}
