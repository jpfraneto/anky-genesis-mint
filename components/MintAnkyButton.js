import React, { useState, useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";

const MintAnkyButton = ({ ethBalance }) => {
  const [mintingError, setMintingError] = useState("");
  const { wallets } = useWallets();
  const thisWallet = wallets[0];

  async function mintAnky() {
    try {
      if (!thisWallet) return;
      console.log("the wallet is: ", thisWallet);
      const provider = await thisWallet.getEthersProvider();
      console.log("the provider is: ", provider);
      let signer = await provider.getSigner();
      console.log("the signer is: ", signer);
      const ankyGenesisContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ANKY_GENESIS_CONTRACT_ADDRESS,
        AnkyGenesisAbi,
        signer
      );
      console.log("this wallet", thisWallet.address, ankyGenesisContract);
      console.log("ETHERS IS:", ethers);
      const ankyPrice = ethers.parseEther("0.01618");

      const tx = await ankyGenesisContract.mint({ value: ankyPrice });
      console.log("the tx is: ", tx);
      alert(
        "your anky was minted. i will make this flow better, but i had to ship this thing"
      );
    } catch (err) {
      console.log("in the error");
      console.log(ethBalance);
      if (+ethBalance >= 0.01618) {
        setMintingError("do you already own an anky?");
      } else {
        setMintingError("do you have enough eth?");
      }
    }
  }
  return (
    <div className="flex flex-col  items-center mb-3">
      <button
        onClick={mintAnky}
        className="  w-48 ml-4 border border-black bg-gradient-to-r  from-purple-500 via-yellow-600 text-xl hover:opacity-70 to-violet-500 text-black p-2 rounded-xl"
      >
        mint my anky
      </button>
      <small className="text-red-500">{mintingError}</small>
    </div>
  );
};

export default MintAnkyButton;
