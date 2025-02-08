import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import axios from "axios";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useParams } from "react-router-dom";
import ExcalidrawEditor from "./ExcalidrawEditor";

const URL = `${import.meta.env.VITE_APP_SERVER}`;

const Slate = () => {

  const { roomId } = useParams();
  const editorRef = useRef(null);
  const bindingRef = useRef(null);
  const providerRef = useRef(null);

  const docRef = useRef(new Y.Doc());
  const doc = docRef.current;

  const yText = doc.getText("monaco");
  const yOutput = doc.getText("output");
  const ySettings = doc.getMap("settings");
  const yTestCases = doc.getArray("testCases");
  const yTestResults = doc.getArray("testResults");

  const [value, setValue] = useState({
    code: "// Start Here !",
    output: "",
    language: ySettings.get("language") || "javascript",
    testCases: yTestCases.toJSON(),
    testResults: yTestResults.toJSON(),
    stdin: "", // optional input for running code
  });

  useEffect(() => {
    providerRef.current = new WebsocketProvider(
      'ws://localhost:1234',
      `${roomId}`,
      doc
    );

    const provider = providerRef.current;

    provider.on("synced", () => {
      console.log("Yjs provider synced!");
    });

    provider.on("status", (event) => {
      if (event.status === "disconnected" && event.code === 4001) {
        alert("Room is full. Please try another room.");
      }
    });

    // Observe changes to the shared output text and update the local state
    const outputObserver = () => {
      setValue((prev) => ({ ...prev, output: yOutput.toString() }));
    };
    yOutput.observe(outputObserver);

    // Observe changes in the settings (language) and update local state
    const settingsObserver = (event) => {
      if (event.keysChanged.has("language")) {
        setValue((prev) => ({ ...prev, language: ySettings.get("language") }));
      }
    };
    ySettings.observe(settingsObserver);

    // Observer for test cases changes.
    const testCasesObserver = () => {
      setValue((prev) => ({ ...prev, testCases: yTestCases.toJSON() }));
    };
    yTestCases.observe(testCasesObserver);

    const testResultsObserver = () => {
      setValue((prev) => ({ ...prev, testResults: yTestResults.toJSON() }));
    };
    yTestResults.observe(testResultsObserver);

    // Cleanup observer on unmount
    return () => {
      yOutput.unobserve(outputObserver);
      ySettings.unobserve(settingsObserver);
      yTestCases.unobserve(testCasesObserver);
      yTestResults.unobserve(testResultsObserver);
      provider.disconnect();
    };
  }, [doc, yOutput, ySettings, yTestCases, yTestResults, roomId]);

  const handleEditorAfterMount = (editor, monaco) => {
    editorRef.current = editor;
    if (!bindingRef.current) {

      bindingRef.current = new MonacoBinding(
        yText,
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        providerRef.current.awareness
      );
    }
    console.log(monaco);
  };

  function handleEditorChange(newCode) {
    setValue((prev) => ({ ...prev, code: newCode }));
  }

  function handleLanguageChange(event) {
    const newLanguage = event.target.value;
    setValue((prev) => ({ ...prev, language: newLanguage }));
    ySettings.set("language", newLanguage);
  }

  // Optional field for entering standard input for running the code
  function handleStdinChange(e) {
    const newStdin = e.target.value;
    setValue((prev) => ({ ...prev, stdin: newStdin }));
  }

  // Adds a new empty test case.
  function addTestCase() {
    yTestCases.push([{ input: "", expectedOutput: "" }]);
  }

  // Renamed the third parameter to newVal.
  function handleTestCaseChange(index, field, newVal) {
    // Get the current array of test cases from Yjs.
    const currentTestCases = yTestCases.toJSON();
    // Create a new object for the updated test case.
    const updatedTestCase = { ...currentTestCases[index], [field]: newVal };
    // Replace the test case at this index by deleting and re-inserting.
    yTestCases.delete(index, 1);
    yTestCases.insert(index, [updatedTestCase]);
  }

  async function runCode() {
    try {
      // Use the value.stdin if provided; otherwise send an empty string.
      const response = await axios.post(`${URL}/execute`, {
        code: value.code,
        language: value.language,
        stdin: value.stdin,
      });

      let newOutput = "";
      if (response.data && response.data.output) {
        newOutput = `${response.data.output}\nTime: ${response.data.time}s\nMemory: ${response.data.memory} KB\nStatus: ${response.data.status}`;
      } else {
        newOutput = "No output returned from server";
      }

      // Update the shared output text.
      yOutput.delete(0, yOutput.length);
      yOutput.insert(0, newOutput);
    } catch (error) {
      const errOutput = `Error: ${error.message}`;
      yOutput.delete(0, yOutput.length);
      yOutput.insert(0, errOutput);
    }
  }

  async function runTests() {
    // Accumulate all test results locally.
    const testResultsArray = [];
    for (const [index, testCase] of value.testCases.entries()) {
      try {
        const response = await axios.post(`${URL}/execute`, {
          code: value.code,
          language: value.language,
          stdin: testCase.input,
        });
        const result = response.data.output || "No output";
        const passed = result.trim() === testCase.expectedOutput.trim();
        testResultsArray.push({
          testCaseIndex: index,
          result: passed ? "Passed" : "Failed",
          output: result,
        });
      } catch (error) {
        testResultsArray.push({
          testCaseIndex: index,
          result: "Failed",
          output: error.message,
        });
      }
    }
    // Clear previous test results and insert the full array at once.
    yTestResults.delete(0, yTestResults.length);
    yTestResults.insert(0, testResultsArray);
  }
  return (
    <div className="bg-black">
      <div className="flex justify-between">
        <div className="text-4xl p-5 font-semibold text-gradient">
          <span className="text-[#e2ff24]">&lt;/</span>
          <span className="text-white">codeslate.io</span>
          <span className="text-[#24fe41]">&gt;</span>
        </div>
        <select value={value.language} onChange={handleLanguageChange} className="w-30 bg-[#5e5e5e] h-10 m-5 p-2 rounded-2xl text-lg text-white font-semibold">
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>


      </div>

      <div className="w-[100vw] h-[65vh]">
        <Editor
          height="100%"
          language={value.language}
          value={value.code}
          theme="vs-dark"
          onChange={handleEditorChange}
          onMount={handleEditorAfterMount}
        />
      </div>

      
      <div className="bg-[#1e1e1e] flex text-[#999999] gap-3 p-2 mt-1">
        <button className="border-2 p-1 rounded-lg" onClick={runCode}>
          Run Code
        </button>
        <button className="border-2 p-1 rounded-lg"
          onClick={runTests}
        >
          Run Tests
        </button>
        <button className="border-2 p-1 rounded-lg"
          onClick={addTestCase}
        >
          Add Test Case
        </button>
      </div>

      

      {/* Optional input field for code execution */}
      <div className="bg-[#1e1e1e] flex text-[#999999] gap-3 p-2 mt-1">
        <label>
          Standard Input:
          <textarea className="border-2"
            value={value.stdin}
            onChange={handleStdinChange}
            style={{ width: "100%", minHeight: "60px" }}
          />
        </label>
      </div>

      {value.testCases.map((testCase, index) => (
        <div key={index} style={{ marginTop: "10px" }}>
          <div>
            <label>Input:</label>
            <textarea
              value={testCase.input}
              onChange={(e) =>
                handleTestCaseChange(index, "input", e.target.value)
              }
              style={{ width: "100%", minHeight: "80px" }}
            />
          </div>
          <div>
            <label>Expected Output:</label>
            <textarea
              value={testCase.expectedOutput}
              onChange={(e) =>
                handleTestCaseChange(index, "expectedOutput", e.target.value)
              }
              style={{ width: "100%", minHeight: "80px" }}
            />
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          background: "#f4f4f4",
          borderRadius: "5px",
        }}
      >
        <h3>Test Results:</h3>
        <ul>
          {value.testResults.map((result, index) => (
            <li
              key={index}
              style={{ color: result.result === "Passed" ? "green" : "red" }}
            >
              <strong>Test {result.testCaseIndex + 1}:</strong> {result.result}{" "}
              - {result.output}
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          background: "#f4f4f4",
          borderRadius: "5px",
        }}
      >
        <h3>Output:</h3>
        <pre>{value.output || "Hello there"}</pre>
      </div>

      <div style={{ height: "96vh", width: "70vw" }}>
        <ExcalidrawEditor roomId={roomId} />
      </div>
    </div>
  );
};

export default Slate;
