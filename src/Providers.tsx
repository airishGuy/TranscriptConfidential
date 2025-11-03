"use client";

import type { ReactNode } from "react";

import { MetaMaskProvider } from "./hooks/metamask/useMetaMaskProvider";
import { MetaMaskEthersSignerProvider } from "./hooks/metamask/useMetaMaskEthersSigner";


type Props = {
  children: ReactNode;
};

const RPC_URL = "https://sepolia.infura.io/v3/b00cf47121f24d27bfbe4b3946cf57b5";

export function Providers({ children }: Props) {
  return (
    <MetaMaskProvider>
      <MetaMaskEthersSignerProvider initialMockChains={{11155111: RPC_URL}}>
        {children}
      </MetaMaskEthersSignerProvider>
    </MetaMaskProvider>
  );
}
