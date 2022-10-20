import { TransactionReceipt, RLPEncodedTransaction } from "web3-core";

export declare type TransactionFunction = (
  to: string,
  amount: number
) => Promise<TransactionReceipt>;

export declare type RLPTransactionFunction = (
  to: string,
  amount: number
) => Promise<RLPEncodedTransaction>;

export declare type BalanceFunction = () => Promise<string | void>;

export declare type GetAccounts = () => Promise<string[]>;

export interface IWalletProvider {
  createAccount: () => string;
  getAccounts: GetAccounts;
  getPrivateKey: () => Promise<string>;
  getChainId: () => Promise<number>;
  getBalance: BalanceFunction;
  getBalanceUSDC: BalanceFunction;
  sendETH: TransactionFunction;
  sendUSDC: TransactionFunction;
}
