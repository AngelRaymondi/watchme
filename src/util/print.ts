import clc from "cli-color";

const print = (input: string, no_color: boolean = false) =>
  console.log(
    `${clc.yellow("[") + "👁️ " + clc.yellow("WatchMe]")} ${
      no_color ? input : clc.green(input)
    }`
  );

export default print;

