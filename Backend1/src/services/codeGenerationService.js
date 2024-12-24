exports.generateCodeFromDiagram = (diagramData, language) => {
  const { classes, relationships } = diagramData;
  let code = "";

  classes.forEach((cls) => {
    const className = cls.name.split(" ")[1]; // Remove visibility from class name
    const visibility = cls.name.split(" ")[0] || "public"; // Default visibility is public if not set

    // Process attributes and methods, clean up and remove the + symbol
    const attributes = cls.attributes.map((attr) => {
      const [name, type] = attr.replace("+", "").split(":").map((item) => item.trim());
      return { name, type };
    });
    const methods = cls.methods.map((method) => method.replace("+", "").trim());

    let inheritance = "";
    const relatedInheritance = relationships.find(
      (rel) => rel.type === "Inheritance" && rel.source === cls.id
    );
    if (relatedInheritance) {
      const parentClass = classes.find((c) => c.id === relatedInheritance.target);
      inheritance = parentClass ? ` extends ${parentClass.name.split(" ")[1]}` : "";
    }

    if (language === "Java") {
      code += generateJavaCode(className, visibility, attributes, methods, inheritance);
    } else if (language === "PHP") {
      code += generatePHPCode(className, visibility, attributes, methods, inheritance);
    } else if (language === "Python") {
      code += generatePythonCode(className, visibility, attributes, methods, inheritance);
    }
  });

  return code.trim();
};

// Java Code Generation
const generateJavaCode = (className, visibility, attributes, methods, inheritance) => {
  const fields = attributes.map((attr) => `  private ${attr.type} ${attr.name};`).join("\n");
  const gettersSetters = attributes
    .map(
      (attr) => `
  public ${attr.type} get${capitalize(attr.name)}() {
    return ${attr.name};
  }

  public void set${capitalize(attr.name)}(${attr.type} ${attr.name}) {
    this.${attr.name} = ${attr.name};
  }
`
    )
    .join("\n");
  const constructorParams = attributes.map((attr) => `${attr.type} ${attr.name}`).join(", ");
  const constructorBody = attributes.map((attr) => `    this.${attr.name} = ${attr.name};`).join("\n");
  const userMethods = methods.map((method) => `  public void ${method}() {\n    // TODO: Implement\n  }`).join("\n");
  const toStringBody = attributes
    .map((attr) => `"${attr.name}=" + ${attr.name}`)
    .join(" + \", \" + ");

  return `
${visibility} class ${className}${inheritance} {
${fields}

  public ${className}(${constructorParams}) {
${constructorBody}
  }

${gettersSetters}

  @Override
  public String toString() {
    return "${className}{" + ${toStringBody} + "}";
  }

${userMethods}
}
`;
};

// PHP Code Generation
const generatePHPCode = (className, visibility, attributes, methods, inheritance) => {
  const fields = attributes.map((attr) => `  private $${attr.name};`).join("\n");
  const gettersSetters = attributes
    .map(
      (attr) => `
  public function get${capitalize(attr.name)}() {
    return $this->${attr.name};
  }

  public function set${capitalize(attr.name)}($${attr.name}) {
    $this->${attr.name} = $${attr.name};
  }
`
    )
    .join("\n");
  const constructorParams = attributes.map((attr) => `$${attr.name}`).join(", ");
  const constructorBody = attributes.map((attr) => `    $this->${attr.name} = $${attr.name};`).join("\n");
  const userMethods = methods.map((method) => `  public function ${method}() {\n    // TODO: Implement\n  }`).join("\n");

  return `
${visibility} class ${className}${inheritance ? ` extends ${inheritance}` : ""} {
${fields}

  public function __construct(${constructorParams}) {
${constructorBody}
  }

${gettersSetters}

  public function __toString() {
    return "${className}{" . ${attributes
      .map((attr) => `"$${attr.name}=" . $this->${attr.name}`)
      .join(' . ", " . ')} . "}";
  }

${userMethods}
}
`;
};

// Python Code Generation
const generatePythonCode = (className, visibility, attributes, methods, inheritance) => {
  const initParams = attributes.map((attr) => `${attr.name}`).join(", ");
  const initBody = attributes.map((attr) => `    self.${attr.name} = ${attr.name}`).join("\n");
  const userMethods = methods
    .map((method) => `  def ${method}(self):\n    # TODO: Implement\n    pass\n`)
    .join("\n");
  const toStringBody = attributes.map((attr) => `f"${attr.name}={self.${attr.name}}"`).join(", ");

  return `
class ${className}${inheritance ? `(${inheritance})` : ""}:
  def __init__(self, ${initParams}):
${initBody}

  def __str__(self):
    return f"${className}({toStringBody})"

${userMethods}
`;
};

// Utility function to capitalize the first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
