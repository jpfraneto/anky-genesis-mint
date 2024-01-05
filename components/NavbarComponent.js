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
        <Navbar.Brand href="#home">ANKY</Navbar.Brand>
        <Navbar.Toggle
          onClick={() => setExpanded(expanded ? false : "expanded")}
          aria-controls="responsive-navbar-nav"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/collection">Collection</Nav.Link>
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
              <Button variant="outline-primary" onClick={login}>
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
