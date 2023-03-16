import {
  Document as ReactPdfDocument,
  Font,
  Page as ReactPdfPage,
  Text as ReactPdfText,
  View as ReactPdfView,
} from "@react-pdf/renderer";
import { Style as ReactPdfStyle } from "@react-pdf/types";
import sum from "lodash/sum";
import React, { ComponentProps, FC, PropsWithChildren } from "react";

Font.register({
  family: "Nasu-Regular",
  src: "src/assets/fonts/Nasu-Regular.ttf",
});
Font.register({
  family: "Nasu-Bold",
  src: "src/assets/fonts/Nasu-Bold.ttf",
});

// to avoid hyphenation. ref: https://github.com/diegomura/react-pdf/issues/692#issuecomment-626580841
Font.registerHyphenationCallback((word: string) => {
  if (word.length === 1) {
    return [word];
  }

  return Array.from(word).reduce<string[]>((arr, char) => {
    arr.push(char, "");
    return arr;
  }, []);
});

export const PdfDocument: FC<
  PropsWithChildren<ComponentProps<typeof ReactPdfDocument>>
> = ({ children, ...props }) => (
  <ReactPdfDocument {...props}>{children}</ReactPdfDocument>
);

export const PdfPage: FC<
  PropsWithChildren<
    Omit<ComponentProps<typeof ReactPdfPage>, "size" | "orientation">
  >
> = ({ children, ...props }) => (
  <ReactPdfPage
    size="A4"
    orientation="landscape"
    {...props}
    style={{ backgroundColor: "#FFF", fontFamily: "Nasu-Regular", padding: 20 }}
  >
    {children}
  </ReactPdfPage>
);

type BoxProps = Partial<{
  paddingX: ReactPdfStyle["padding"];
  paddingY: ReactPdfStyle["padding"];
  marginX: ReactPdfStyle["margin"];
  marginY: ReactPdfStyle["margin"];
}> &
  ReactPdfStyle;

export const PdfView: FC<PropsWithChildren<BoxProps>> = ({
  children,
  margin,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginX,
  marginY,
  padding,
  paddingTop = 0,
  paddingRight = 0,
  paddingBottom = 0,
  paddingLeft = 0,
  paddingX,
  paddingY,
  flexDirection = "column",
  ...props
}) => {
  const multiplier = 10;
  const multiplySpace = (value: any) =>
    typeof value === "number" && Number(value) > 0 ? value * multiplier : value;
  return (
    <ReactPdfView
      style={{
        display: "flex",
        flexDirection,
        ...(margin
          ? {
              margin: multiplySpace(margin),
            }
          : {
              marginLeft: multiplySpace(marginX ?? marginLeft),
              marginRight: multiplySpace(marginX ?? marginRight),
              marginTop: multiplySpace(marginY ?? marginTop),
              marginBottom: multiplySpace(marginY ?? marginBottom),
            }),
        ...(padding
          ? {
              padding: multiplySpace(padding),
            }
          : {
              paddingLeft: multiplySpace(paddingX ?? paddingLeft),
              paddingRight: multiplySpace(paddingX ?? paddingRight),
              paddingTop: multiplySpace(paddingY ?? paddingTop),
              paddingBottom: multiplySpace(paddingY ?? paddingBottom),
            }),
        ...props,
      }}
      wrap={false}
    >
      {children}
    </ReactPdfView>
  );
};

export const PdfText: FC<
  PropsWithChildren<{
    size?: number;
    bold?: boolean;
    fontColor?: "black" | "grey";
  }>
> = ({ size = 12, bold = false, fontColor = "black", children }) => (
  <ReactPdfText
    style={{
      fontSize: size,
      ...(bold ? { fontFamily: "Nasu-Bold" } : null),
      color: fontColor,
    }}
  >
    {children}
  </ReactPdfText>
);

export const PdfTable: FC<PropsWithChildren<{ noBottomBorder?: boolean }>> = ({
  children,
  noBottomBorder,
}) => (
  <PdfView
    border="1 solid black"
    {...(noBottomBorder ? { borderBottom: "0" } : {})}
  >
    {children}
  </PdfView>
);

type DistributedArray<T> = T extends T ? T[] : never;

export const PdfRow: FC<
  PropsWithChildren<{
    data: DistributedArray<string | number>;
    bold?: boolean;
    height?: number;
    colWidth?: number[];
    type?: "standalone" | "tableRow";
    alignItems?: Record<number, ReactPdfStyle["alignItems"]>;
  }>
> = ({
  data,
  bold = false,
  height,
  colWidth = Array(data.length).fill(1),
  type = "standalone",
  alignItems = {},
}) => {
  const totalWidth = sum(colWidth);
  return (
    <PdfView
      flexDirection="row"
      // marginBottom={-1}
      height={height}
      {...(type === "standalone"
        ? { border: "1 solid black" }
        : { borderBottom: "1 solid black" })}
    >
      {data.length > 0 &&
        data.map((item, idx, array) => {
          item = item === "" ? "--" : item;
          return (
            <PdfView
              key={idx}
              borderRight={
                array.length - 1 !== idx ? "1 solid black" : undefined
              }
              marginRight={array.length - 1 !== idx ? -1 : 0}
              width={`${(colWidth[idx] / totalWidth) * 100}%`}
              paddingLeft={0.5}
              {...(alignItems[idx] &&
                alignItems[idx] !== "flex-start" && { paddingRight: 0.5 })}
              justifyContent="center"
              alignItems={alignItems[idx]}
            >
              <PdfText size={8} bold={bold}>
                {Number.isInteger(Number(item))
                  ? Number(item).toLocaleString()
                  : item}
              </PdfText>
            </PdfView>
          );
        })}
    </PdfView>
  );
};
