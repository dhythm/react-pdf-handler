import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { FC } from "react";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGlow: 1,
  },
});

interface Props {
  text: string;
}
export const SimpleDocument: FC<Props> = ({ text }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
        <Text>{text} #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
        <Text>{text} #2</Text>
      </View>
    </Page>
  </Document>
);
