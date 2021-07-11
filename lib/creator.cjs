'use strict';

/* eslint-disable promise/no-nesting */

const { resolver, Base, logger } = require('./utils.cjs');

function Creator({ read, write }) {
  return class Chain extends Base {
    constructor(root) {
      super();
      if (root) {
        this.root = root;
      }
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
          logger.okay(...message);
          return io;
        },
        (error) => {
          logger.fail(...message);
          throw error;
        },
      );
      return this;
    }
  };
}

module.exports = { Creator };
