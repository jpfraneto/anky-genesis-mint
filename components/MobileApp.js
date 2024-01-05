import { usePrivy, useWallets } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import AnkyGenesisAbi from "../lib/AnkyGenesisAbi";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import CollectionPage from "./collection/CollectionPage";
import AboutPage from "./about/AboutPage";

const MobileApp = ({ setDisplayFullScreen, setEthBalance, ethBalance }) => {
  const router = useRouter();
  const [mintingError, setMintingError] = useState("");
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
      } catch (error) {
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
      }
    }
    getUsersAnky();
  }, [thisWallet]);
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
    } catch (err) {
      console.log("in the error");
      console.log(ethBalance);
      if (+ethBalance >= 0.01618) {
        console.log("HEREAS");
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
            ethBalance={ethBalance}
            setDisplayFullScreen={setDisplayFullScreen}
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
                  <span>mint anky genesis</span>
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
                  <span>login</span>
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

export default MobileApp;
