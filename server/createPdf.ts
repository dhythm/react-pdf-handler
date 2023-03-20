import { memoryUsage } from "node:process";
import ReactPDF, { renderToFile } from "@react-pdf/renderer";
import { SamplePdf } from "../src/SamplePdf";
import { Command } from "commander";

const VOLUME = 10_000;

const program = new Command();
program.parse(process.argv);
const COUNT_ROWS = Number(program.args[0] ?? VOLUME);

const main = async () => {
  const fileName = `${__dirname}/sample.pdf`;
  await renderToFile(
    SamplePdf({
      data: [...Array(COUNT_ROWS)].map((_, idx) => `${idx + 1}`),
    }),
    fileName
  );
  console.log("It works!");
};

(async () => {
  const start = process.hrtime();
  await main();
  const end = process.hrtime(start);
  console.log(memoryUsage());
  console.log({ rows: COUNT_ROWS, start, end });
})();
