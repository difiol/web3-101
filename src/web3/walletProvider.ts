import { SafeEventEmitterProvider } from "@web3auth/base";
import ethProvider from "./ethProvider";
import { IWalletProvider } from "./wallet";

export const getWalletProvider = (
  provider: SafeEventEmitterProvider
): IWalletProvider => {
  return ethProvider(provider);
};
