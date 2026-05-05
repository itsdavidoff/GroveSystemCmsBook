"use client";

import { EditorElement, useEditor } from "@/app/providers/editor-provider";
import { JSX } from "react";
import ElementWrapper from "./element-wrapper";

type Props = {
  element: EditorElement;
};

function TextComponent({ element }: Props) {
  const { state, dispatch } = useEditor();

  const handleBlur = (e: React.FocusEvent<Element>) => {
    const textElement = e.target as HTMLElement;
    const newText = textElement.innerText.trim();
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          content: { innerText: newText },
        },
      },
    });
  };

  const TextTag = element.type as keyof JSX.IntrinsicElements;

  // Extract custom CSS from styles
  const styles = element.styles as any;
  const { cssText, ...inlineStyles } = styles;

  // Convert cssText string to an object if possible, or just apply it
  // Since we can't easily parse CSS string to React style object without a library,
  // we'll use a data attribute and a global style tag for the selected element
  // or just apply basic parsing for now.
  
  const customStyles: React.CSSProperties = { ...inlineStyles };
  
  if (cssText) {
    const lines = cssText.split(';');
    lines.forEach((line: string) => {
      const [prop, value] = line.split(':');
      if (prop && value) {
        const camelProp = prop.trim().replace(/-([a-z])/g, (g: any) => g[1].toUpperCase());
        (customStyles as any)[camelProp] = value.trim();
      }
    });
  }

  return (
    <ElementWrapper element={element}>
      <div
        style={customStyles}
        className="p-[2px] w-full relative transition-all overflow-auto"
      >
        <TextTag
          contentEditable={!state.editor.liveMode}
          suppressContentEditableWarning
          onBlur={handleBlur}
          className="border-none outline-none"
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          {!Array.isArray(element.content) && element.content.innerText}
        </TextTag>
      </div>
    </ElementWrapper>
  );
}

export default TextComponent;
