import { memoryUsage } from "node:process";
import ReactPDF, { renderToFile } from "@react-pdf/renderer";
import { SamplePdf } from "../src/SamplePdf";

const VOLUME = 1000;

const main = async () => {
  const fileName = `${__dirname}/sample.pdf`;
  await renderToFile(
    SamplePdf({ data: [...Array(VOLUME)].map((_, idx) => `${idx + 1}`) }),
    fileName
  );
  console.log("It works!");
};

(async () => {
  const start = process.hrtime();
  await main();
  const end = process.hrtime(start);
  console.log(memoryUsage());
  console.log({ rows: VOLUME, start, end });
})();
