import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

describe("Counter", function () {
  // Fixture to deploy the contract and get necessary objects
  async function deployCounterFixture() {
    // Get wallet clients for testing
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    // Deploy the counter contract
    const counter = await hre.viem.deployContract("Counter");

    return {
      counter,
      owner,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { counter, owner } = await loadFixture(deployCounterFixture);

      expect(await counter.read.owner()).to.equal(
        getAddress(owner.account.address)
      );
    });

    it("Should initialize count to zero", async function () {
      const { counter } = await loadFixture(deployCounterFixture);

      expect(await counter.read.count()).to.equal(0n);
    });
  });

  describe("Increment", function () {
    it("Should increment the count when called by owner", async function () {
      const { counter } = await loadFixture(deployCounterFixture);

      await counter.write.increment();
      expect(await counter.read.count()).to.equal(1n);
    });

    it("Should emit CountIncremented event", async function () {
      const { counter } = await loadFixture(deployCounterFixture);
      await counter.write.increment();

      const events = await counter.getEvents.CountIncremented();
      expect(events).to.have.lengthOf(1);
      expect(events[0].args.count).to.equal(1n);
    });

    it("Should revert when called by non-owner", async function () {
      const { counter, otherAccount } = await loadFixture(deployCounterFixture);

      const counterAsOther = await hre.viem.getContractAt(
        "Counter",
        counter.address,
        { client: { wallet: otherAccount } }
      );

      await expect(counterAsOther.write.increment()).to.be.rejectedWith(
        "Only the owner can call this function"
      );
    });
  });

  describe("Decrement", function () {
    it("Should decrement the count when called by owner", async function () {
      const { counter } = await loadFixture(deployCounterFixture);

      // First increment to 1
      await counter.write.increment();
      // Then decrement back to 0
      await counter.write.decrement();
      expect(await counter.read.count()).to.equal(0n);
    });

    it("Should emit CountDecremented event", async function () {
      const { counter } = await loadFixture(deployCounterFixture);

      await counter.write.increment();
      await counter.write.decrement();

      const events = await counter.getEvents.CountDecremented();
      expect(events).to.have.lengthOf(1);
      expect(events[0].args.count).to.equal(0n);
    });

    it("Should revert when called by non-owner", async function () {
      const { counter, otherAccount } = await loadFixture(deployCounterFixture);

      const counterAsOther = await hre.viem.getContractAt(
        "Counter",
        counter.address,
        { client: { wallet: otherAccount } }
      );

      await expect(counterAsOther.write.decrement()).to.be.rejectedWith(
        "Only the owner can call this function"
      );
    });

    it("Should revert when count would become negative", async function () {
      const { counter } = await loadFixture(deployCounterFixture);

      await expect(counter.write.decrement()).to.be.rejectedWith(
        "Count cannot be negative"
      );
    });
  });
});