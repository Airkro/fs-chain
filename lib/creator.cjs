/* eslint-disable promise/no-nesting */
const { green, red } = require('chalk');

const { resolver, ChainError } = require('./utils.cjs');

function Creator({ read, write }) {
  return class Chain {
    constructor(root) {
      if (root) {
        this.root = root;
      }
      this.action = Promise.resolve();
      return this;
    }

    config(option) {
      if (option !== undefined) {
        this.option = option;
      }
      return this;
    }

    source(path, root = this.root) {
      if (!path) {
        throw new Error('path cannot be empty');
      }
      this.action = this.action
        .then(() => {
          this.source = resolver(path, root);
        })
        .then(() => read(this.source));

      return this;
    }

    handle(transform) {
      this.action = this.action.then((data) => transform(data));
      return this;
    }

    output(path, root = this.root) {
      this.action = this.action.then((data) => {
        const io = resolver(path === undefined ? this.source : path, root);
        if (!io) {
          throw new Error('path cannot be empty');
        }
        this.source = io;
        return write(io, data, this.option).then(() => data);
      });

      return this;
    }

    logger(...message) {
      if (message.length === 0) {
        throw new Error('message cannot be empty');
      }

      this.action = this.action.then(
        (io) => {
          console.log(green('√'), ...message);
          return io;
        },
        (error) => {
          console.log(red('×'), ...message);
          throw error;
        },
      );
      return this;
    }

    then(resolve, reject) {
      return this.action.then(
        resolve,
        reject ? (error) => reject(new ChainError(error, this)) : undefined,
      );
    }

    catch(callback) {
      return this.action.catch((error) =>
        callback(new ChainError(error, this)),
      );
    }

    finally(callback) {
      return this.action.finally(callback);
    }
  };
}

module.exports = { Creator };
