import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { ethers } from "ethers";
import Link from "next/link";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export default function NavbarComponent() {
  const [mintingError, setMintingError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const { login, authenticated, logout } = usePrivy();
  const { wallets } = useWallets();
  const thisWallet = wallets && wallets[0];

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
      const tx = await ankyGenesisContract.mint();
      console.log("the tx is: ", tx);
    } catch (error) {
      console.log("there was an error", error);
      setMintingError("do you have enough eth?");
    }
  }

  return (
    <Navbar expanded={expanded} bg="light" expand="lg" className="mb-3">
      <Container>
        <Link href="/" className="hover:text-purple-600 ">
          ANKY
        </Link>
        <Navbar.Toggle
          onClick={() => setExpanded(expanded ? false : "expanded")}
          aria-controls="responsive-navbar-nav"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="-ml-1">
            <Link href="/about" className="mx-2 hover:text-purple-600">
              About
            </Link>
            <Link href="/collection" className="mx-2 hover:text-purple-600">
              Collection
            </Link>
            <Link href="/links" className="mx-2 hover:text-purple-600">
              Links
            </Link>
            {/* Add other navigation links as needed */}
          </Nav>
          <Nav>
            {authenticated ? (
              <>
                <Button variant="outline-primary" onClick={logout}>
                  Logout
                </Button>
                <Navbar.Text className="ml-2">
                  {thisWallet?.address || ""}
                </Navbar.Text>
              </>
            ) : (
              <div className="mt-2">
                <Button variant="outline-primary" onClick={login}>
                  Login
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
