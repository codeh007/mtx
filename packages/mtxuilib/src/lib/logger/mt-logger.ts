const isDebug = true;

//辅助参考
// const trace = (): Array<string> => {
//   const e = new Error("dummy");
//   return (
//     e.stack
//       ?.replace(/^[^(]+?[\n$]/gm, "")
//       .replace(/^\s+at\s+/gm, "")
//       .replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@")
//       .split("\n") ?? []
//   );
// };

export type LogFn = typeof console.log;
const originLogger = console.log;
const originConsoleTable = console.table;
const originConsoleError = console.error;
//自定义logger,
//特点： 保持console.log 中行号。
export class MtLogger {
  private logPrefix = "";
  constructor(logPrefix?: string) {
    if (logPrefix) {
      this.logPrefix = `[${logPrefix}]: `;
    }
  }

  get debug() {
    if (!isDebug) {
      return () => {};
    }
    const logPrefix = this.logPrefix;
    if (logPrefix.length) {
      return originLogger.bind(console, logPrefix);
    } else {
      return originLogger.bind(console);
    }
  }
  get log() {
    if (!isDebug) {
      return () => {};
    }
    const logPrefix = this.logPrefix;
    if (logPrefix.length) {
      return originLogger.bind(console, logPrefix);
    } else {
      return originLogger.bind(console);
    }
  }

  get warn() {
    if (!isDebug) {
      return () => {};
    }
    const logPrefix = this.logPrefix;
    if (logPrefix.length) {
      return console.warn.bind(console, logPrefix);
    } else {
      return console.warn.bind(console);
    }
  }

  get dir() {
    if (!isDebug) {
      return () => {};
    }
    const logPrefix = this.logPrefix;
    if (logPrefix.length) {
      return console.dir.bind(console, logPrefix);
    } else {
      return console.dir.bind(console);
    }
  }

  get error() {
    if (!isDebug) {
      return () => {};
    }
    const logPrefix = this.logPrefix;
    if (logPrefix.length) {
      return originConsoleError.bind(console, logPrefix);
    } else {
      return originConsoleError.bind(console);
    }
  }

  get table() {
    if (!isDebug) {
      return () => {};
    }
    const logPrefix = this.logPrefix;
    if (logPrefix.length) {
      return originConsoleTable.bind(console, logPrefix);
    } else {
      return originConsoleTable.bind(console);
    }
  }
  //如果需要，可以将console中其他方法都添加进来。
}

export const mtlogger = new MtLogger();
