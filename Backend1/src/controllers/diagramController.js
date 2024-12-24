const { generateCodeFromDiagram } = require("../services/codeGenerationService");

exports.generateCode = (req, res) => {
  const { diagramData, language } = req.body;
  if (!diagramData || !language) {
    return res.status(400).json({ error: "Diagram data and language are required." });
  }

  const code = generateCodeFromDiagram(diagramData, language);
  res.json({ code });
};
