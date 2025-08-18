// executeCode.js
import axios from "axios";

const LANGUAGE_CONFIG = {
  python: { pistonLang: "python3", ext: "py" },
  javascript: { pistonLang: "javascript", ext: "js" },
  c: { pistonLang: "c", ext: "c" },
};

// map possible aliases → your config keys
const normalizeLanguage = (lang) => {
  if (!lang) return "python";
  const lower = lang.toLowerCase();

  if (["python3", "py"].includes(lower)) return "python";
  if (["js", "node", "nodejs"].includes(lower)) return "javascript";
  if (["c99", "gcc"].includes(lower)) return "c";

  return lower; // if already "python", "javascript", or "c"
};

export async function executeCode(language, code) {
  const normalizedLang = normalizeLanguage(language);
  const config = LANGUAGE_CONFIG[normalizedLang];

  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: config.pistonLang,
      version: "*",
      files: [
        {
          name: `main.${config.ext}`,
          content: code,
        },
      ],
    });

    return response.data.run.output || "";
  } catch (err) {
    console.error("Execution error:", err.response?.data || err.message);
    throw new Error("Failed to execute code.");
  }
}
