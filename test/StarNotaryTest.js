const StarNotary = artifacts.require("StarNotary");

const stars = [
  [
    "Star power 101!",
    "I love my wonderful star1",
    "ra_032.155",
    "dec_121.874",
    "mag_245.978"
  ],
  [
    "Star power 102!",
    "I love my wonderful star2",
    "ra_032.156",
    "dec_121.874",
    "mag_245.978"
  ],
  [
    "Star power 103!",
    "I love my wonderful star3",
    "ra_032.155",
    "dec_121.875",
    "mag_245.978"
  ]
];

contract("StarNotary", accounts => {
  beforeEach(async function() {
    this.contract = await StarNotary.new({ from: accounts[0] });
  });

  describe("can create a star and check existance/absence", () => {
    it("can create a star, verify data, and check existance", async function() {
      let tokenId = 1;

      await this.contract.createStar(...stars[0], tokenId);

      assert.deepEqual(
        await this.contract.tokenIdToStarInfo(tokenId),
        stars[0]
      );

      assert.isOk(
        await this.contract.checkIfStarExist(...stars[0].slice(2, 5)),
        "star existance failed"
      );
      assert.isNotOk(
        await this.contract.checkIfStarExist(...stars[1].slice(2, 5)),
        "star present when it should not be"
      );
    });

    it("can not create the same star twice even with different IDs", async function() {
      let receipt = await this.contract.createStar(...stars[0], 2);

      try {
        receipt = await this.contract.createStar(...stars[0], 3);
        assert.isOk(false, "coordinate duplicate error not thrown");
      } catch (e) {
        assert.isAbove(
          e.message.indexOf("coordinate duplicate"),
          0,
          "no duplicate star found and it should be"
        );
      }
    });

    it("minting unique stars does not fail", async function() {
      const name = "awesome star!";
      const starStory = "this star was bought for my wife's birthday";

      for (let i = 0; i < 10; i++) {
        let id = i;
        let newRa = i.toString();
        let newDec = i.toString();
        let newMag = i.toString();

        await this.contract.createStar(
          name,
          starStory,
          newRa,
          newDec,
          newMag,
          id,
          { from: accounts[0] }
        );

        let starInfo = await this.contract.starIdToStarInfo(id);
        assert.equal(starInfo[0], name);
      }
    });
  });

  describe("buying and selling stars", () => {
    let user1 = accounts[1];
    let user2 = accounts[2];
    let randomMaliciousUser = accounts[3];

    let starId = 1;
    let starPrice = web3.toWei(0.01, "ether");

    beforeEach(async function() {
      await this.contract.createStar(...stars[0], starId, { from: user1 });
    });

    it("user1 can put up their star for sale", async function() {
      assert.equal(await this.contract.ownerOf(starId), user1);
      await this.contract.putStarUpForSale(starId, starPrice, { from: user1 });
      assert.equal(await this.contract.starsForSale(starId), starPrice);
    });

    describe("user2 can buy a star that was put up for sale", () => {
      beforeEach(async function() {
        await this.contract.putStarUpForSale(starId, starPrice, {
          from: user1
        });
      });

      it("user2 is the owner of the star after they buy it", async function() {
        await this.contract.buyStar(starId, {
          from: user2,
          value: starPrice,
          gasPrice: 0
        });
        assert.equal(await this.contract.ownerOf(starId), user2);
      });

      it("user2 ether balance changed correctly", async function() {
        let overpaidAmount = web3.toWei(0.05, "ether");
        const balanceBeforeTransaction = web3.eth.getBalance(user2);
        await this.contract.buyStar(starId, {
          from: user2,
          value: overpaidAmount,
          gasPrice: 0
        });
        const balanceAfterTransaction = web3.eth.getBalance(user2);

        assert.equal(
          balanceBeforeTransaction.sub(balanceAfterTransaction),
          starPrice
        );
      });
    });
  });
});
