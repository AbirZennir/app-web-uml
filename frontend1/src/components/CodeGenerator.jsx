import React, { useState } from "react";
import axios from "axios";
import "../style/DiagramEditor.css";

const CodeGenerator = ({ graph }) => {
  const [generatedCode, setGeneratedCode] = useState("");
  const [language, setLanguage] = useState("Java");

  const extractDiagramData = () => {
    const cells = graph.getCells();
    const diagramData = {
      classes: cells
        .filter((cell) => cell.isElement())
        .map((cell) => ({
          name: cell.get("name"),
          attributes: cell.get("attributes"),
          methods: cell.get("methods"),
        })),
      relationships: cells
        .filter((cell) => cell.isLink())
        .map((cell) => ({
          type: cell.attributes.type,
          source: cell.attributes.source.id,
          target: cell.attributes.target.id,
        })),
    };
    return diagramData;
  };

  const generateCode = async () => {
    const diagramData = extractDiagramData();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/generate-code",
        {
          diagramData,
          language,
        }
      );
      setGeneratedCode(response.data.code);
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  return (
    <div>
      <div className="select-button-container" style={{ marginTop : 10}}>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="Java">Java</option>
          <option value="PHP">PHP</option>
          <option value="Python">Python</option>
        </select>
        <button className="button" onClick={generateCode}>Generate Code</button>
      </div>
      {generatedCode && (
        <textarea
          value={generatedCode}
          readOnly
          rows={10}
          cols={50}
          style={{ marginTop: "10px", width: "100%" , height : "100%"}}
        />
      )}
    </div>
  );
};

export default CodeGenerator;
