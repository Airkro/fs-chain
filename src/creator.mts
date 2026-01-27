import { Base, logger, resolver } from './utils.mts';

export function Creator<T, O = unknown>(options: {
  read: (path: string) => Promise<T>;
  write: (path: string, data: T, option?: O) => Promise<void>;
}) {
  return class Chain extends Base {
    root?: string;

    option?: O;

    sourcePath?: string;

    constructor(root?: string) {
      super();

      if (root) {
        this.root = root;
      }
    }

    config(option: O): this {
      if (option !== undefined) {
        this.option = option;
      }

      return this;
    }

    source(path: string, root = this.root): this {
      if (!path) {
        throw new Error('path cannot be empty');
      }

      this.action = this.action
        .then(() => {
          this.sourcePath = resolver(path, root);
        })
        .then(() =>
          this.sourcePath ? options.read(this.sourcePath) : undefined,
        );

      return this;
    }

    output(path = this.sourcePath, root = this.root): this {
      this.action = this.action.then((data) => {
        const io = path ? resolver(path, root) : undefined;

        if (!io) {
          throw new Error('path cannot be empty');
        }

        this.sourcePath = io;

        return options.write(io, data as T, this.option).then(() => data);
      });

      return this;
    }

    logger(...message: unknown[]): this {
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
