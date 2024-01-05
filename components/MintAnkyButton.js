import React, { useState, useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";

const MintAnkyButton = ({
  mintAnky,
  ethBalance,
  mintingError,
  loadingMintAnky,
}) => {
  const { wallets } = useWallets();
  const [mintedTokenId, setMintedTokenId] = useState("");
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const thisWallet = wallets[0];

  return (
    <div className="flex flex-col  items-center mb-3">
      <button
        onClick={mintAnky}
        className="  w-48 ml-4 border border-black bg-gradient-to-r  from-purple-500 via-yellow-600 text-xl hover:opacity-70 to-violet-500 text-black p-2 rounded-xl"
      >
        {loadingMintAnky ? "minting..." : "mint anky genesis"}
      </button>
      <small className="text-red-500">{mintingError}</small>
    </div>
  );
};

export default MintAnkyButton;
