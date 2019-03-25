const { readFileSync, outputFileSync } = require("fs-extra");

module.exports = class FsChain {
  constructor(name = "fs-chain") {
    this.name = name;
    this.data = "";
    return this;
  }

  message(msg) {
    this.msg = msg;
    return this;
  }

  source(src = "") {
    this.data = readFileSync(src, { encoding: "utf-8" });
    return this;
  }

  handle(transform) {
    this.data = transform(this.data);
    return this;
  }

  target(outpath = this.src) {
    outputFileSync(outpath, this.data);
    console.log(this.name + ": " + this.msg + ".");
  }
};
