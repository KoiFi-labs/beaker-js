import {PeraWalletConnect} from "@perawallet/connect";
import { useState, useEffect } from "react";



export default function PeraWalletConnector() {
  const peraWallet = new PeraWalletConnect();
  const [accountAddress, setAccountAddress] = useState([])
  const isConnectedToPeraWallet = accountAddress.length;

  const handleDisconnectWalletClick = () => {
    peraWallet.disconnect();
    setAccountAddress([]);
  }

  const handleConnectWalletClick = () =>{
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
        setAccountAddress(newAccounts[0] as unknown as never[]);
      }, (error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error)
        }
      });
  }

  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
      if (accounts.length) setAccountAddress(accountAddress[0])
    });
  }, []);

  return (
    <button
      onClick={
        isConnectedToPeraWallet ? handleDisconnectWalletClick : handleConnectWalletClick
      }>
      <h2>{isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}</h2>
    </button>
  );
}