import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import AnkyGenesisAbi from "../lib/AnkyGenesisAbi";
import AboutPage from "./about/AboutPage";
import { ethers } from "ethers";
import CollectionPage from "./collection/CollectionPage";

const DesktopApp = ({
  setDisplayFullScreenIndex,
  setMintingError,
  mintingError,
}) => {
  const router = useRouter();
  const [loadingMintAnky, setLoadingMintAnky] = useState(false);
  const [ethBalance, setEthBalance] = useState(0);
  const { login, authenticated, user, logout, ready, loading } = usePrivy();
  const { wallets } = useWallets();
  const thisWallet = wallets[0];

  useEffect(() => {
    async function getUsersBalance() {
      if (!thisWallet) return;
      try {
        const provider = await thisWallet.getEthersProvider();
        const balance = await provider.getBalance(thisWallet.address);
        console.log("the BAAAALANCE is ", balance);
        const usersEth = await ethers.formatEther(balance._hex);
        setEthBalance(usersEth);
      } catch (error) {}
    }
    getUsersBalance();
  }, [authenticated]);

  useEffect(() => {
    async function getUsersAnky() {
      if (!thisWallet) return;
      try {
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
        const tx = await ankyGenesisContract.balanceOf(thisWallet.address);
        const userBalance = ethers.formatUnits(tx, 0);
        console.log("the user balance is: ", userBalance);
        if (userBalance > 0) {
          let usersAnky = await ankyGenesisContract.tokenOfOwnerByIndex(
            thisWallet.address,
            0
          );
          console.log("the users anky is: ", usersAnky);
          const decodedUsersAnky = ethers.formatUnits(usersAnky, 0);
          console.log("the decoded users anky is: ", decodedUsersAnky);
        }
        console.log("the tx is: ", tx);

        console.log("the anky genesis contract is: ", ankyGenesisContract);
      } catch (error) {}
    }
    getUsersAnky();
  }, [thisWallet]);

  async function mintAnky() {
    try {
      if (!thisWallet) return;
      setLoadingMintAnky(true);
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
      if (tx) {
        setTransactionSuccess(true);
        const mintedTokenId = BigNumber.from(tx.receipt.logs[0].topics[3]);
        setMintedTokenId(mintedTokenId);
      }
      alert(
        "your anky was minted. i will make this flow better, but i had to ship this thing"
      );
    } catch (err) {
      console.log("in the error", err);
      console.log(ethBalance);
      if (+ethBalance >= 0.01618) {
        setMintingError("do you already own an anky?");
      } else {
        setMintingError("do you have enough eth?");
      }
    }
  }

  function getComponentForRoute(route, router) {
    if (!ready || loading) return;

    switch (route) {
      case "/collection":
        return (
          <CollectionPage
            mintAnky={mintAnky}
            ethBalance={ethBalance}
            loadingMintAnky={loadingMintAnky}
            mintingError={mintingError}
            setDisplayFullScreenIndex={setDisplayFullScreenIndex}
          />
        );
      case "/about":
        return <AboutPage />;

      default:
        return (
          <div>
            {authenticated ? (
              <div className="flex flex-col justify-center items-center">
                <p>your eth balance is {ethBalance}</p>
                <button
                  onClick={mintAnky}
                  variant="text"
                  size="sm"
                  className="p-2 w-fit my-2 bg-purple-400 border border-black rounded-xl"
                >
                  {loadingMintAnky ? "minting..." : "mint anky genesis"}
                </button>
                {mintingError && (
                  <small className=" text-red-200">{mintingError}</small>
                )}
              </div>
            ) : (
              <div className="p-2">
                <p>welcome to anky</p>
                <p>login to mint your anky genesis nft on ethereum mainnet</p>
                <p>it is 0.01618 eth</p>

                <button
                  onClick={login}
                  variant="text"
                  size="sm"
                  className="p-2 w-36 my-2 bg-purple-400 border border-black rounded-xl"
                >
                  login
                </button>
              </div>
            )}
          </div>
        );
    }
  }

  return (
    <div className="h-full w-full">
      {getComponentForRoute(router.pathname, router)}
    </div>
  );
};

export default DesktopApp;
