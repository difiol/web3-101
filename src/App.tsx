import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from "@web3auth/base";
import "./App.css";
import { getWalletProvider } from "./web3/walletProvider";
import { IWalletProvider } from "./web3/wallet";
import { Loader, TextInput } from "@mantine/core";

const clientId = process.env.REACT_APP_CLIENT_ID as string; // get from https://dashboard.web3auth.io

export default function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [walletProvider, setWalletProvider] = useState<IWalletProvider | null>(
    null
  );
  const [text, setText] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const subscribeAuthEvents = (web3auth: any) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
        console.log(`Yeah!, you are successfully logged in  ${data}`);
        if (web3auth.provider) setWalletProvider(web3auth.provider);
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting...");
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
      });

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error: string) => {
        console.log(`some error or user has cancelled login request ${error}`);
      });
    };

    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x5",
            rpcTarget: "https://rpc.ankr.com/eth_goerli", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) setWallet(web3auth.provider);

        subscribeAuthEvents(web3auth);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const setWallet = (web3authProvider: SafeEventEmitterProvider) => {
    const walletProvider = getWalletProvider(web3authProvider);
    setWalletProvider(walletProvider);
  };

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    if (web3authProvider) setWallet(web3authProvider);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
    setText(user.email!);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setWalletProvider(null);
  };

  const getChainId = async () => {
    if (!walletProvider) {
      console.log("provider not initialized yet");
      return;
    }
    const chainId = await walletProvider.getChainId();
    console.log(chainId);
    setText(chainId.toString());
  };

  const getAccounts = async () => {
    if (!walletProvider) {
      console.log("provider not initialized yet");
      return;
    }
    const address = await walletProvider.getAccounts();
    setText(address.join(","));
  };

  const createAccount = async () => {
    if (!walletProvider) {
      console.log("provider not initialized yet");
      return;
    }
    const address = walletProvider.createAccount();
    setText(address);
  };

  const getBalance = async () => {
    if (!walletProvider) {
      console.log("provider not initialized yet");
      return;
    }
    const balance = await walletProvider.getBalance();
    setText(`You have ${balance} ETH`);
  };

  const getBalanceUSDC = async () => {
    if (!walletProvider) {
      console.log("provider not initialized yet");
      return;
    }

    try {
      setIsLoading(true);
      const balance = await walletProvider.getBalanceUSDC();
      setText(`You have ${balance} USDC`);
      setIsLoading(false);
    } catch {
      setText(`Transaction failed`);
    }
  };

  const sendETH = async () => {
    if (!walletProvider) {
      console.log("provider not initialized yet");
      return;
    }
    try {
      setIsLoading(true);
      const txRes = await walletProvider.sendETH(to, amount);
      setIsLoading(false);
      if (txRes.status)
        setText(`Transaction sent successfully \n ${txRes.transactionHash}`);
    } catch {
      setText(`Transaction failed`);
    }
  };

  const sendUSDC = async () => {
    if (!walletProvider) {
      console.log("provider not initialized yet");
      return;
    }
    try {
      setIsLoading(true);
      const txRes = await walletProvider.sendUSDC(to, amount);
      setIsLoading(false);
      if (txRes.status)
        setText(`Transaction sent successfully \n ${txRes.transactionHash}`);
    } catch {
      setText(`Transaction failed`);
    }
  };

  const getPrivateKey = async () => {
    if (!walletProvider) {
      console.log("provider not initialized yet");
      return;
    }
    const privateKey = await walletProvider.getPrivateKey();
    setText(privateKey);
  };

  const loggedInView = (
    <>
      <form
        style={{ marginBottom: "20px" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <TextInput
          withAsterisk
          label="Account to send to"
          placeholder="0x0000000000000000"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <TextInput
          withAsterisk
          label="Amount"
          placeholder="amount to send"
          type={"number"}
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />
      </form>
      <button onClick={getUserInfo} className="card">
        Get User Info
      </button>
      <button onClick={getChainId} className="card">
        Get Chain ID
      </button>
      <button onClick={getAccounts} className="card">
        Get Accounts
      </button>
      <button onClick={createAccount} className="card">
        Create Account
      </button>
      <button onClick={getPrivateKey} className="card">
        Get Private Key
      </button>
      <button onClick={getBalance} className="card">
        Get Balance
      </button>
      <button onClick={sendETH} className="card">
        Send Transaction
      </button>
      <button onClick={getBalanceUSDC} className="card">
        Get USDC Balance
      </button>
      <button onClick={sendUSDC} className="card">
        Send USDC
      </button>
      <button onClick={logout} className="card">
        Log Out
      </button>

      <div
        id="console"
        style={{
          whiteSpace: "pre-line",
          textAlign: "center",
          color: "white",
          backgroundColor: "black",
          width: "75%",
          margin: "20px",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <p style={{ whiteSpace: "pre-line" }}>
          {isLoading ? <Loader /> : text}
        </p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>
        & ReactJS Example
      </h1>

      <div className="grid">
        {walletProvider ? loggedInView : unloggedInView}
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/Web3Auth/tree/master/examples/react-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}
