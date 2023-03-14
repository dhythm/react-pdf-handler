import chunk from "lodash/chunk";
import React from "react";
import {
  PdfDocument,
  PdfPage,
  PdfRow,
  PdfTable,
  PdfText,
  PdfView,
} from "./components/Pdf";

// 20 is padding of page
const pageHeight = 595.28 - 20 * 2;

const headerRowHeight = 16;

// const dataPerPageMd = 15;
const dataPerPageMd = 20;
const rowHeightMd = pageHeight / dataPerPageMd;

// const dataPerPageLg = 11;
const dataPerPageLg = 15;
const rowHeightLg = pageHeight / dataPerPageLg;

interface Props {
  data: string[];
}
export const SamplePdf = ({ data }: Props) => {
  return (
    <PdfDocument>
      <PdfPage>
        <PdfView>
          <PdfText>First Page</PdfText>
        </PdfView>
      </PdfPage>
      <PdfPage wrap={false}>
        <PdfView>
          <PdfText>wrap prop is false</PdfText>
        </PdfView>
      </PdfPage>
      <PdfPage wrap={false}>
        <PdfView height={pageHeight}>
          <PdfText>wrap prop is false, View has height</PdfText>
        </PdfView>
      </PdfPage>
      <PdfPage>
        <PdfView>
          <PdfText>wrap prop is true</PdfText>
        </PdfView>
      </PdfPage>
      {splitByPages(data, {
        dataPerPage: dataPerPageLg,
        headerRowCount: 4,
      }).map((rows, pageCount) => {
        return (
          <PdfPage key={pageCount} wrap={false}>
            <PdfView height={pageHeight}>
              <PdfTable noBottomBorder>
                {pageCount === 0 && (
                  <>
                    <PdfView
                      height={headerRowHeight}
                      marginY={-1}
                      borderBottom="1 solid black"
                    >
                      <PdfText size={12} bold>
                        Header has height
                      </PdfText>
                    </PdfView>
                    <PdfRow
                      height={rowHeightLg * 4 - headerRowHeight}
                      data={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                      type="tableRow"
                      colWidth={[4, 6, 2, 2, 2, 2, 2, 2, 2, 1]}
                      bold
                    />
                  </>
                )}
                {rows.map((row, rowCount) => (
                  <PdfRow
                    key={rowCount}
                    data={[`${row}`, "", "", "", "", "", "", "", "", ""]}
                    type="tableRow"
                    colWidth={[4, 6, 2, 2, 2, 2, 2, 2, 2, 1]}
                    alignItems={{ 2: "flex-end" }}
                    height={rowHeightLg}
                  />
                ))}
              </PdfTable>
            </PdfView>
          </PdfPage>
        );
      })}
      {splitByPages(data, {
        dataPerPage: dataPerPageMd,
        headerRowCount: 1,
      }).map((rows, pageCount) => {
        return (
          <PdfPage key={pageCount} wrap={false}>
            <PdfView height={pageHeight}>
              <PdfTable noBottomBorder>
                {pageCount === 0 && (
                  <>
                    <PdfView
                      height={headerRowHeight}
                      marginY={-1}
                      borderBottom="1 solid black"
                    >
                      <PdfText size={12} bold>
                        Header has height
                      </PdfText>
                    </PdfView>
                    <PdfRow
                      height={rowHeightMd - headerRowHeight}
                      data={["1", "2", "3", "4", "5"]}
                      type="tableRow"
                      colWidth={[3, 3, 1, 1, 1]}
                      bold
                    />
                  </>
                )}
                {rows.map((row, rowCount) => (
                  <PdfRow
                    key={rowCount}
                    data={[`${row}`, "", "", "", ""]}
                    type="tableRow"
                    colWidth={[3, 3, 1, 1, 1]}
                    alignItems={{ 2: "flex-end" }}
                    height={rowHeightMd}
                  />
                ))}
              </PdfTable>
            </PdfView>
          </PdfPage>
        );
      })}
    </PdfDocument>
  );
};

interface SplitByPagesOptions {
  dataPerPage: number;
  headerRowCount: number;
}
// https://github.com/diegomura/react-pdf/issues/314#issuecomment-685031622
const splitByPages = (
  data: any[],
  { dataPerPage, headerRowCount }: SplitByPagesOptions
) => {
  const numberOfDataInFirstPage = dataPerPage - headerRowCount;
  return [
    data.slice(0, numberOfDataInFirstPage),
    ...chunk(data.slice(numberOfDataInFirstPage), dataPerPage),
  ];
};
