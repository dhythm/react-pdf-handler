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
const PAGE_HEIGHT = 595.28 - 20 * 2;

const HEADER_ROW_COUNT_MD = 1;
const DATA_PER_PAGE_MD = 20;
const ROW_HEIGHT_MD = PAGE_HEIGHT / DATA_PER_PAGE_MD;

const HEADER_ROW_COUNT_LG = 4;
const DATA_PER_PAGE_LG = 15;
const HEADER_HEIGHT_LG = 120;
const ROW_HEIGHT_LG = PAGE_HEIGHT / DATA_PER_PAGE_LG;

const LONG_JP_TEXT =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";

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
        <PdfView height={PAGE_HEIGHT}>
          <PdfText>wrap prop is false, View has height</PdfText>
        </PdfView>
      </PdfPage>
      <PdfPage>
        <PdfView>
          <PdfText>wrap prop is true</PdfText>
        </PdfView>
      </PdfPage>
      {splitByPages(data, {
        dataPerPage: DATA_PER_PAGE_LG,
        headerRowCount: 4,
      }).map((rows, pageCount) => {
        return (
          <PdfPage key={pageCount} wrap={false}>
            <PdfView height={PAGE_HEIGHT}>
              <PdfTable noBottomBorder>
                {pageCount === 0 && (
                  <>
                    <PdfView
                      height={
                        ROW_HEIGHT_LG * HEADER_ROW_COUNT_LG - HEADER_HEIGHT_LG
                      }
                      marginY={-1}
                      borderBottom="1 solid black"
                    >
                      <PdfText size={12} bold>
                        Header has height
                      </PdfText>
                    </PdfView>
                    <PdfRow
                      height={HEADER_HEIGHT_LG}
                      data={[
                        "氏名又は名称",
                        "住所",
                        "社債金額（円）",
                        "取得日",
                        "募集社債と引換えにする金銭の払込みに代えて金銭以外の財産の給付があったときはその財産の価額及び給付の日",
                        "社債権者が募集社債と引換えにする金銭の払込みをする債務と会社に対する債権とを相殺したときはその債権の額及び相殺をした日",
                        "質権者の氏名又は名称",
                        "質権者の住所",
                        "質権の目的である社債",
                        "備考",
                      ]}
                      type="tableRow"
                      colWidth={[4, 6, 2, 2, 2, 2, 2, 2, 2, 1]}
                      bold
                    />
                  </>
                )}
                {rows.map((row, rowCount) => (
                  <PdfRow
                    key={rowCount}
                    data={[
                      LONG_JP_TEXT,
                      LONG_JP_TEXT,
                      `${row}`,
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                    ]}
                    type="tableRow"
                    colWidth={[4, 6, 2, 2, 2, 2, 2, 2, 2, 1]}
                    alignItems={{ 2: "flex-end" }}
                    height={ROW_HEIGHT_LG}
                  />
                ))}
              </PdfTable>
            </PdfView>
          </PdfPage>
        );
      })}
      {splitByPages(data, {
        dataPerPage: DATA_PER_PAGE_MD,
        headerRowCount: HEADER_ROW_COUNT_MD,
      }).map((rows, pageCount) => {
        return (
          <PdfPage key={pageCount} wrap={false}>
            <PdfView height={PAGE_HEIGHT}>
              <PdfTable noBottomBorder>
                {pageCount === 0 && (
                  <>
                    <PdfView borderBottom="1 solid black">
                      <PdfText size={12} bold>
                        明細
                      </PdfText>
                    </PdfView>
                    <PdfRow
                      data={[
                        "氏名又は名称",
                        "住所",
                        "保有数量（口）",
                        "保有金額（円）",
                        "取得日",
                      ]}
                      type="tableRow"
                      colWidth={[3, 3, 1, 1, 1]}
                      bold
                    />
                  </>
                )}
                {rows.map((row, rowCount) => (
                  <PdfRow
                    key={rowCount}
                    data={[LONG_JP_TEXT, LONG_JP_TEXT, `${row}`, "", ""]}
                    type="tableRow"
                    colWidth={[3, 3, 1, 1, 1]}
                    alignItems={{ 2: "flex-end" }}
                    height={ROW_HEIGHT_MD}
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
