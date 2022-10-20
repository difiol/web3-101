import { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { usdc } from "./usdc";
import { IWalletProvider } from "./wallet";

const ethProvider = (provider: SafeEventEmitterProvider): IWalletProvider => {
  const web3 = new Web3(provider as any);

  // Get ERC20 Token contract instance (abi, address)
  const contractUSDC = new web3.eth.Contract(
    usdc.abi as AbiItem[],
    usdc.contractAddress
  );

  const createAccount = () => {
    return web3.eth.accounts.create().address;
  };

  const getAccounts = async () => {
    return web3.eth.getAccounts();
  };

  const getPrivateKey = async () => {
    try {
      const privateKey = await provider.request({
        method: "eth_private_key",
      });

      return privateKey as string;
    } catch (error) {
      return error as string;
    }
  };

  const getChainId = async () => {
    return web3.eth.getChainId();
  };

  const getBalance = async () => {
    const accounts = await getAccounts();
    const balance = await web3.eth.getBalance(accounts[0]);
    return web3.utils.fromWei(balance);
  };

  const getBalanceUSDC = async () => {
    const accounts = await getAccounts();

    // Get ERC20 Token contract instance (abi, address)
    const contract = new web3.eth.Contract(
      usdc.abi as AbiItem[],
      usdc.contractAddress
    );
    const balance = await contract.methods.balanceOf(accounts[0]).call();
    const normalizedBalance = web3.utils.fromWei(balance, "mwei");

    return normalizedBalance;
  };

  const sendETH = async (to: string, amount: number) => {
    const accounts = await getAccounts();
    const txRes = await web3.eth.sendTransaction({
      from: accounts[0],
      to,
      value: web3.utils.toWei(amount.toString()),
    });
    return txRes;
  };

  const sendUSDC = async (to: string, amount: number) => {
    const accounts = await getAccounts();

    const data = contractUSDC.methods.transfer(to, amount * 1000000);
    const txRes = await web3.eth.sendTransaction({
      from: accounts[0],
      to: usdc.contractAddress,
      value: web3.utils.toWei("0"),
      gas: 510579,
      data: data.encodeABI(),
    });
    return txRes;
  };

  return {
    createAccount,
    getAccounts,
    getPrivateKey,
    getChainId,
    getBalance,
    getBalanceUSDC,
    sendETH,
    sendUSDC,
  };
};

export default ethProvider;
