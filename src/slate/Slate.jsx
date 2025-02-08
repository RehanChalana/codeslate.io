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

  const [showTestCases, setShowTestCases] = useState(true);
  const [showOutput, setShowOutput] = useState(false);
  const [showTestResults, setShowTestResults] = useState(false);

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
      "ws://localhost:1234",
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
    setShowTestCases(true);
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

      setShowTestCases(false);
      setShowOutput(true);
      setShowTestResults(false);

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
    setShowTestCases(false);
    setShowTestResults(true);
    setShowOutput(false);

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

  const deleteTestCase = (index) => {
    yTestCases.delete(index, 1);
  };

  return (
    <div className="bg-[#24fe41]">
      <div className="flex justify-between mb-[1px] bg-[#141414f9]">
        <div className="text-3xl p-5 font-semibold text-gradient">
          <span className="text-[#e2ff24]">&lt;/</span>
          <span className="text-white">codeslate.io</span>
          <span className="text-[#24fe41]">&gt;</span>
        </div>
        <select
          value={value.language}
          onChange={handleLanguageChange}
          className="w-40 bg-[#141414de] h-10 m-5 p-2 px-4 rounded-md text-lg text-white"
        >
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>
      </div>

      <div className="w-[100%] h-[65vh]">
        <Editor
          height="100%"
          language={value.language}
          value={value.code}
          theme="vs-dark"
          onChange={handleEditorChange}
          onMount={handleEditorAfterMount}
          options={{
            fontSize: 16, // Increase text size
          }}
        />
      </div>

      <div className="bg-[#1e1e1e] flex gap-4 p-4 mt-[1px]">
        <button
          className="border-1 p-2 px-3 rounded-md bg-[#e2ff24]"
          onClick={runCode}
        >
          Run Code
        </button>
        <button
          className="border-1 p-2 px-3 rounded-md bg-[#e2ff24]"
          onClick={runTests}
        >
          Run Tests
        </button>
        <button
          className="border-1 p-2 px-3 rounded-md bg-[#e2ff24]"
          onClick={addTestCase}
        >
          Add Test Case
        </button>
      </div>

      {/* Optional input field for code execution */}

      <div className="flex gap-10 w-[100%] p-4 px-10 bg-[#1e1e1e] border border-gray-700 items-center justify-center">
        <div className="flex-30 flex flex-col">
          <input
            className="w-[80%] p-3 bg-[#111]/80 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-[#e2ff24] transition-all duration-200"
            value={value.stdin}
            placeholder="Enter standard input..."
            onChange={handleStdinChange}
          />
        </div>
      </div>

      {showTestCases &&
        value.testCases.map((testCase, index) => (
          <div
            key={index}
            className="flex gap-10 w-[100%] p-4 px-10 bg-[#1e1e1e] border border-gray-700
                      items-center justify-center"
          >
            <div className="flex-1 text-white">{index + 1}.</div>
            <div className="flex-30 flex flex-col">
              <input
                className="w-[100%] p-3 bg-[#111]/80 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-[#e2ff24] transition-all duration-200"
                value={testCase.input}
                placeholder="Input:"
                onChange={(e) =>
                  handleTestCaseChange(index, "input", e.target.value)
                }
              />
            </div>
            <div className="flex-30 flex flex-col">
              <input
                className="w-[100%] p-3 bg-[#111]/80 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-[#e2ff24] transition-all duration-200"
                value={testCase.expectedOutput}
                placeholder="Expected Output:"
                onChange={(e) =>
                  handleTestCaseChange(index, "expectedOutput", e.target.value)
                }
              />
            </div>
            <button
              className="border-1 p-2 px-3 rounded-md bg-red-500 text-white hover:bg-red-700"
              onClick={() => deleteTestCase(index)}
            >
              Delete
            </button>
          </div>
        ))}

      {showTestResults && (
        <div className="mt-4 p-4 bg-[#f4f4f4] rounded-md">
          <h3 className="text-lg font-semibold">Test Results:</h3>
          <ul>
            {value.testResults.map((result, index) => (
              <li
                key={index}
                className={
                  result.result === "Passed" ? "text-green-500" : "text-red-500"
                }
              >
                <strong>Test {result.testCaseIndex + 1}:</strong>{" "}
                {result.result} - {result.output}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(
        <div className="mt-4 p-4 bg-[#f4f4f4] rounded-md">
          <h3 className="text-lg font-semibold">Output:</h3>
          <pre>{value.output || "Hello there"}</pre>
        </div>
      )}

      <h1>
        White Board
      </h1>

      <div style={{ height: "96vh", width: "100%" }}>
        <ExcalidrawEditor roomId={roomId} />
      </div>
    </div>
  );
};

export default Slate;
