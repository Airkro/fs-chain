import { logger, resolver, readFile, writeFile } from './utils.mts';

export class Chain {
  private chain: Promise<unknown>;

  private fallbackValue?: unknown;

  root?: string;

  option?: { pretty?: boolean };

  sourcePath?: string;

  constructor(root?: string) {
    this.chain = Promise.resolve();
    this.root = root;
  }

  get action(): Promise<unknown> {
    return this.chain;
  }

  private saveTemp(data: unknown): unknown {
    this.fallbackValue = data;

    return data;
  }

  modify(callback: (io: unknown) => unknown = (io) => io): this {
    this.chain = this.chain.then(this.saveTemp.bind(this)).then(callback);

    return this;
  }

  onFail(callback: () => unknown = () => this.fallbackValue): this {
    this.chain = this.chain.then(this.saveTemp.bind(this)).catch(callback);

    return this;
  }

  // eslint-disable-next-line unicorn/no-thenable
  then(callback: (value: unknown) => unknown): Promise<unknown> {
    return this.chain.then(callback);
  }

  catch(callback: (reason: unknown) => unknown): Promise<unknown> {
    return this.chain.catch(callback);
  }

  finally(callback: () => void): Promise<unknown> {
    return this.chain.finally(callback);
  }

  config(option: { pretty?: boolean }): this {
    this.option = option;

    return this;
  }

  source(path: string, root = this.root): this {
    if (!path) {
      throw new Error('path cannot be empty');
    }

    this.chain = this.chain
      .then(() => {
        this.sourcePath = resolver(path, root);
      })
      .then(async () =>
        this.sourcePath ? readFile(this.sourcePath) : undefined,
      );

    return this;
  }

  output(path = this.sourcePath, root = this.root): this {
    this.chain = this.chain.then((data) => {
      const outputPath = path ? resolver(path, root) : undefined;

      if (!outputPath) {
        throw new Error('path cannot be empty');
      }

      this.sourcePath = outputPath;

      return writeFile(outputPath, data as string).then(() => data);
    });

    return this;
  }

  encode(): this {
    this.chain = this.chain.then((data) =>
      JSON.stringify(data, undefined, this.option?.pretty ? 2 : undefined),
    );

    return this;
  }

  decode<T>(): this {
    this.chain = this.chain.then((data) => JSON.parse(data as string) as T);

    return this;
  }

  logger(...message: unknown[]): this {
    if (message.length === 0) {
      throw new Error('message cannot be empty');
    }

    this.chain = this.chain.then(
      (data) => {
        logger.okay(...message);

        return data;
      },
      (error) => {
        logger.fail(...message);
        throw error;
      },
    );

    return this;
  }
}
