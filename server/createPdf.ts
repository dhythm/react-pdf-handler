import ReactPDF, { renderToFile } from "@react-pdf/renderer";
import { SamplePdf } from "../src/SamplePdf";

const main = async () => {
  const fileName = `${__dirname}/sample.pdf`;
  await renderToFile(
    SamplePdf({ data: [...Array(35)].map((_, idx) => `${idx + 1}`) }),
    fileName
  );
  console.log("It works!");
};

(async () => {
  await main();
})();
