import reactLogo from "./assets/react.svg";
import "./App.css";
import { PDFViewer, usePDF } from "@react-pdf/renderer";
import PDFMerger from "pdf-merger-js/browser";
import { useState } from "react";
import { SimpleDocument } from "./SimpleDocument";

function App() {
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>();
  const [instance1] = usePDF({ document: <SimpleDocument text="foo" /> });
  const [instance2] = usePDF({ document: <SimpleDocument text="bar" /> });

  if (instance1.loading || instance2.loading) return <div>Loading...</div>;

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={async () => {
            const merger = new PDFMerger();

            if (instance1.blob == null || instance2.blob == null) {
              console.log("blob is null.");
              return;
            }
            await merger.add(instance1.blob);
            await merger.add(instance2.blob);

            const mergedPdf = await merger.saveAsBlob();
            const url = URL.createObjectURL(mergedPdf);

            setMergedPdfUrl(url);
          }}
        >
          Save PDF
        </button>
        <p>{mergedPdfUrl}</p>
      </div>
      <PDFViewer>
        <SimpleDocument text="text" />
      </PDFViewer>
    </div>
  );
}

export default App;
