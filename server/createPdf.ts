import { memoryUsage } from "node:process";
import ReactPDF, { renderToFile, renderToStream } from "@react-pdf/renderer";
import { SamplePdf } from "../src/SamplePdf";
import { Command } from "commander";
import { Base64Encode } from "base64-stream";

const VOLUME = 10_000;

const program = new Command();
program.option("-s, --stream", "use stream").parse(process.argv);
const options = program.opts();
const COUNT_ROWS = Number(program.args[0] ?? VOLUME);

const toFile = async () => {
  const fileName = `${__dirname}/sample.pdf`;
  await renderToFile(
    SamplePdf({
      data: [...Array(COUNT_ROWS)].map((_, idx) => `${idx + 1}`),
    }),
    fileName
  );
};

const toStream = async () => {
  const stream = await renderToStream(
    SamplePdf({
      data: [...Array(COUNT_ROWS)].map((_, idx) => `${idx + 1}`),
    })
  );
  const promise = () => {
    let data = "";
    return new Promise((resolve, reject) => {
      stream
        .pipe(new Base64Encode())
        .on("data", (chunk) => {
          data += chunk;
        })
        .on("end", () => {
          resolve(data);
        })
        .on("error", (error) => reject(error));
    });
  };
  const base64str = await promise();
};

(async () => {
  const start = process.hrtime();
  if (options.stream) {
    console.log("mode: stream");
    await toStream();
  } else {
    console.log("mode: file");
    await toFile();
  }
  const end = process.hrtime(start);
  const usages = memoryUsage();
  const messages = [];
  console.log(
    Object.entries(usages)
      .map(
        ([key, value]) =>
          `${key}: ${Math.round((value / 1024 ** 2) * 100) / 100} MB`
      )
      .join(", ")
  );
  console.log({ rows: COUNT_ROWS, start, end });
})();
