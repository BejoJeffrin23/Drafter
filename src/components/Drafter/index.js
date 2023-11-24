import React from "react";
import { Editor, EditorState, Modifier } from "draft-js";
import "draft-js/dist/Draft.css";

export default function MyEditor({ editorState, setEditorState }) {
  const editor = React.useRef(null);
  function focusEditor() {
    editor.current.focus();
  }

  const handleChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const selectionState = newEditorState.getSelection();
    const currentBlock = contentState.getBlockForKey(
      selectionState.getStartKey()
    );
    const blockText = currentBlock.getText();

    const applyStyle = (style, blockType = null) => {
      let resetContentState = contentState;
      let stylesToRemove = ["REDLINE", "BOLD", "UNDERLINE"];
      stylesToRemove.forEach((style) => {
        resetContentState = Modifier.removeInlineStyle(
          resetContentState,
          selectionState.merge({
            anchorOffset: 0,
            focusOffset: blockText.length,
          }),
          style
        );
      });

      resetContentState = Modifier.setBlockType(
        resetContentState,
        selectionState,
        "unstyled"
      );
      let updatedContentState;
      if (blockType) {
        updatedContentState = Modifier.setBlockType(
          resetContentState,
          selectionState.merge({
            anchorOffset: 0,
            focusOffset: blockText.length,
          }),
          blockType
        );
      } else {
        updatedContentState = Modifier.applyInlineStyle(
          resetContentState,
          selectionState.merge({
            anchorOffset: 0,
            focusOffset: blockText.length,
          }),
          style
        );
      }
      const newContentState = EditorState.push(
        newEditorState,
        updatedContentState,
        blockType ? "change-block-type" : "change-inline-style"
      );
      setEditorState(newContentState);
      return true;
    };

    const handlePattern = (text, pattern, style, blockType = null) => {
      if (text.startsWith(pattern + " ") && text.trim() === pattern.trim()) {
        return applyStyle(style, blockType);
      }
      return false;
    };

    if (
      handlePattern(blockText, "**", "REDLINE") ||
      handlePattern(blockText, "***", "UNDERLINE") ||
      handlePattern(blockText, "#", null, "header-one") ||
      handlePattern(blockText, "*", "BOLD") ||
      handlePattern(blockText, "```", null, "code-block")
    ) {
      return;
    }

    setEditorState(newEditorState);
  };

  const styleMap = {
    REDLINE: {
      color: "red",
    },
  };

  return (
    <div className="editorContainer" onClick={focusEditor}>
      <Editor
        ref={editor}
        customStyleMap={styleMap}
        editorState={editorState}
        onChange={handleChange}
        placeholder="Enter the content!"
      />
    </div>
  );
}
