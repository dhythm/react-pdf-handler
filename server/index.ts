import PDFmerger from "pdf-merger-js";
import ReactPDF from "@react-pdf/renderer";
import { SimpleDocument } from "../src/SimpleDocument";
import fs from "fs";

const main = async () => {
  const merger = new PDFmerger();

  const document1 = SimpleDocument({ text: "foo" });
  if (!document1) {
    return;
  }
  await ReactPDF.renderToFile(document1, `${__dirname}/1.pdf`);
  const document2 = SimpleDocument({ text: "bar" });
  if (!document2) {
    return;
  }
  await ReactPDF.renderToFile(document2, `${__dirname}/2.pdf`);

  await merger.add(`${__dirname}/1.pdf`);
  await merger.add(`${__dirname}/2.pdf`);

  await merger.save(`${__dirname}/merged.pdf`);
  fs.unlink(`${__dirname}/1.pdf`, (err) => {
    if (err) throw err;
  });
  fs.unlink(`${__dirname}/2.pdf`, (err) => {
    if (err) throw err;
  });
  console.log("It works!");
};

(async () => {
  await main();
})();
