import axios from "axios";

export async function executePythonCode(code) {
  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: "python3",
      version: "3.10.0",
      files: [
        {
          name: "main.py",
          content: code
        }
      ]
    });

    const { run } = response.data;
    const { stdout, stderr } = run;

    if (stderr) return `❌ Error:\n${stderr}`;
    if (stdout) return `✅ Output:\n${stdout}`;

    return "⚠️ No output received.";
  } catch (err) {
    console.error("Piston Error:", err.response?.data || err.message);
    return "❌ Could not run code using Piston API.";
  }
}
