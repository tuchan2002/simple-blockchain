const hash = require("crypto-js/sha256");

class Block {
  constructor(prevHash, data) {
    this.prevHash = prevHash;
    this.data = data;
    this.timeStamp = new Date();

    this.hash = this.calculateHash();
    this.mineVar = 0;
  }

  calculateHash() {
    return hash(
      this.prevHash + JSON.stringify(this.data) + this.timeStamp + this.mineVar
    ).toString();
  }

  mine(difficulty) {
    while (!this.hash.startsWith("0".repeat(difficulty))) {
      this.hash = this.calculateHash();
      this.mineVar++;
    }
  }
}

class Blockchain {
  constructor(difficulty) {
    const genesisBlock = new Block("0000", { isGenesis: true });

    this.chain = [genesisBlock];
    this.difficulty = difficulty;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const lastBlock = this.getLastBlock();
    const newBlock = new Block(lastBlock.hash, data);

    console.log("start mining");
    console.time("mine");
    newBlock.mine(this.difficulty);
    console.timeEnd("mine");
    console.log("end mining");

    this.chain.push(newBlock);
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.prevHash !== prevBlock.hash) {
        return false;
      }

      return true;
    }
  }
}

const chain1 = new Blockchain(4);
chain1.addBlock({ from: "tu", to: "chan", amount: 100 });
chain1.addBlock({ link: "abc.xyz" });
console.log(chain1);
console.log("chain valid: ", chain1.isValid());
