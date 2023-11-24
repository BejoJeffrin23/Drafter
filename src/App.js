import MyEditor from "./components/Drafter";
import "./App.css";
import Title from "./components/Title";
import { useEffect, useState } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const savedEditorState = localStorage.getItem("editorState");
    if (savedEditorState) {
      const parsedEditorState = JSON.parse(savedEditorState);
      setEditorState(
        EditorState.createWithContent(convertFromRaw(parsedEditorState))
      );
    }
  }, []);

  const saveStateInLocalStorage = (newEditorState) => {
    setSaved(true);
    const contentState = newEditorState.getCurrentContent();
    const rawState = convertToRaw(contentState);
    localStorage.setItem("editorState", JSON.stringify(rawState));
    setTimeout(() => {
      setSaved(false);
    }, 1000);
  };

  return (
    <div className="container">
      <div style={{ textAlign: "center", margin: "20px 10px" }}>
        <Title name={"BEJO JEFFRIN"} />
        <button
          onClick={() => saveStateInLocalStorage(editorState)}
          className={saved ? "successButton" : "saveButton"}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
      <MyEditor editorState={editorState} setEditorState={setEditorState} />
    </div>
  );
}

export default App;
