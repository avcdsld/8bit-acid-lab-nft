import hre, { ethers } from "hardhat";
import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);
const { expect } = chai;

describe("HappyEncryption", function () {
  const id = 1;
  const uri = "test uri";

  let signer: SignerWithAddress;
  let buyer: SignerWithAddress;
  let nftContract: any;

  this.beforeEach(async function () {
    [signer, buyer] = await ethers.getSigners();
    const HappyEncryption = await ethers.getContractFactory("HappyEncryption");
    nftContract = await HappyEncryption.deploy();

    const amount = 2;
    const data = "0x00";
    await nftContract.setTokenURI(id, uri);
    await nftContract.setMaxSupply(id, 10);
    await nftContract.mint(buyer.address, id, amount, data);
  });

  it("Test", async function () {
    const actualURI = await nftContract.uri(id);
    console.log(actualURI);
    chai.assert.equal(actualURI, uri);
  });
});
