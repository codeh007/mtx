import { title } from "process";

export class Mtlogger2 {
  constructor(private lokiUrl?: string) {}
  green(title: string): (...args: any) => void {
    return console.log.bind(
      console,
      `%c${title}`,
      `background: #222; color: #31A821`,
    );
  }

  red(title: string): (...args: any) => void {
    return console.log.bind(
      console,
      `%c${title}`,
      `background: #222; color: #DA5555`,
    );
  }

  blue(title: string): (...args: any) => void {
    console.log.bind(console)("dddddddddddblueddddddd");
    return console.log.bind(
      console,
      `%c${title}`,
      `background: #222; color: #A5F0FA`,
    );
  }

  purple(title: string): (...args: any) => void {
    return console.log.bind(
      console,
      `%c${title}`,
      `background: #222; color: #A955DA`,
    );
  }

  yellow(title: string): (...args: any) => void {
    return console.log.bind(
      console,
      `%c${title}`,
      `background: #222; color: #EFEC47`,
    );
  }

  /**
   * 例子： mtlogger2.info()("somemessage %o", { some: "data" });
   */
  info = () => {
    return console.log.bind(
      console,
      `%c${title}`,
      `background: #222; color: #EFEC47`,
    );
  };

}

export const mtlogger2 = new Mtlogger2("xxxx");
