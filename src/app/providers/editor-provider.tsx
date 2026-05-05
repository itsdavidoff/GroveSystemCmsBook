"use client";
import { Dispatch, createContext, useContext, useReducer } from "react";
import { CategoryTypes, ElementTypes } from "../../lib/constants";
import { EditorAction } from "./editor-actions";
import { Page } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

export type DeviceTypes = "Desktop" | "Tablet" | "Mobile";

export type EditorElement = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: ElementTypes;
  category: CategoryTypes;
  content:
    | EditorElement[]
    | {
        href?: string;
        innerText?: string;
        imageUrl?: string;
        altText?: string;
        destinationUrl?: string;
      };
};

export type Editor = {
  siteId: string;
  liveMode: boolean;
  previewMode: boolean;
  visible: boolean;
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DeviceTypes;
  designTokens: {
    fonts: { primary: string; secondary: string };
    colors: { primary: string; secondary: string };
  };
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const initialEditorState: EditorState["editor"] = {
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "__body",
      category: "Container",
    },
  ],
  selectedElement: {
    id: "",
    content: [],
    name: "",
    styles: {},
    type: null,
    category: null,
  },
  device: "Desktop",
  previewMode: false,
  liveMode: false,
  visible: false,
  siteId: "",
  designTokens: {
    fonts: { primary: "Inter, sans-serif", secondary: "Inter, sans-serif" },
    colors: { primary: "#000000", secondary: "#666666" },
  },
};

const initialHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
};

const addElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "ADD_ELEMENT") {
    throw Error(
      "Wrong action type received to add an element to the editor state."
    );
  }

  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addElement(item.content, action),
      };
    }
    return item;
  });
};

const updateElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "UPDATE_ELEMENT") {
    throw Error("Wrong action type received to update an elements state.");
  }

  return editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return {
        ...item,
        ...action.payload.elementDetails,
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: updateElement(item.content, action),
      };
    }
    return item;
  });
};

const deleteElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "DELETE_ELEMENT") {
    throw Error("Wrong action type received to delete an element.");
  }

  return editorArray.filter((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return false;
    } else if (item.content && Array.isArray(item.content)) {
      item.content = deleteElement(item.content, action);
    }
    return true;
  });
};

const duplicateElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "DUPLICATE_ELEMENT") {
    throw Error("Wrong action type received to duplicate an element.");
  }

  // Recursive function to generate new IDs for all children
  const cloneWithNewId = (element: EditorElement): EditorElement => {
    const newId = createId();
    return {
      ...element,
      id: newId,
      content: Array.isArray(element.content)
        ? element.content.map((child) => cloneWithNewId(child))
        : { ...element.content },
    };
  };

  const newEditorArray: EditorElement[] = [];

  for (const item of editorArray) {
    newEditorArray.push(item);
    if (item.id === action.payload.elementDetails.id) {
      newEditorArray.push(cloneWithNewId(item));
    } else if (item.content && Array.isArray(item.content)) {
      item.content = duplicateElement(item.content, action);
    }
  }

  return newEditorArray;
};

const editorReducer = (
  state: EditorState = initialState,
  action: EditorAction
): EditorState => {
  switch (action.type) {
    case "ADD_ELEMENT":
      const updatedEditorState = {
        ...state.editor,
        elements: addElement(state.editor.elements, action),
      };

      const updatedHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorState },
      ];

      const newEditorState = {
        ...state,
        editor: updatedEditorState,
        history: {
          ...state.history,
          history: updatedHistory,
          currentIndex: updatedHistory.length - 1,
        },
      };

      return newEditorState;

    case "UPDATE_ELEMENT":
      const updatedElements = updateElement(state.editor.elements, action);
      const updatedElementIsSelected =
        state.editor.selectedElement.id === action.payload.elementDetails.id;

      const updatedEditorStateWithUpdate = {
        ...state.editor,
        elements: updatedElements,
        selectedElement: updatedElementIsSelected
          ? action.payload.elementDetails
          : {
              id: "",
              content: [],
              name: "",
              styles: {},
              type: null,
              category: null,
            },
      };

      const updatedHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithUpdate },
      ];

      const newEditorStateWithUpdate = {
        ...state,
        editor: updatedEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updatedHistoryWithUpdate,
          currentIndex: updatedHistoryWithUpdate.length - 1,
        },
      };

      return newEditorStateWithUpdate;

    case "DELETE_ELEMENT":
      const updatedElementsAfterDelete = deleteElement(
        state.editor.elements,
        action
      );

      const updatedEditorStateAfterDelete = {
        ...state.editor,
        elements: updatedElementsAfterDelete,
        selectedElement: {
          id: "",
          content: [],
          name: "",
          styles: {},
          type: null,
          category: null,
        },
      };

      const updatedHistoryAfterDelete = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateAfterDelete },
      ];

      const deletedState = {
        ...state,
        editor: updatedEditorStateAfterDelete,
        history: {
          ...state.history,
          history: updatedHistoryAfterDelete,
          currentIndex: updatedHistoryAfterDelete.length - 1,
        },
      };

      return deletedState;

    case "DUPLICATE_ELEMENT":
      const duplicatedElements = duplicateElement(state.editor.elements, action);

      const duplicatedEditorState = {
        ...state.editor,
        elements: duplicatedElements,
      };

      const updatedHistoryAfterDuplicate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...duplicatedEditorState },
      ];

      return {
        ...state,
        editor: duplicatedEditorState,
        history: {
          ...state.history,
          history: updatedHistoryAfterDuplicate,
          currentIndex: updatedHistoryAfterDuplicate.length - 1,
        },
      };

    case "CHANGE_SELECTED_ELEMENT":
      const clickedState = {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload.elementDetails || {
            id: "",
            content: [],
            name: "",
            styles: {},
            type: null,
            category: null,
          },
        },
        history: {
          ...state.history,
          history: [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor },
          ],
          currentIndex: state.history.currentIndex + 1,
        },
      };

      return clickedState;

    case "CHANGE_DEVICE":
      const changedDeviceState = {
        ...state,
        editor: { ...state.editor, device: action.payload.device },
      };

      return changedDeviceState;

    case "TOGGLE_PREVIEW_MODE":
      const togglePreviewMode = {
        ...state,
        editor: { ...state.editor, previewMode: !state.editor.previewMode },
      };

      return togglePreviewMode;

    case "TOGGLE_LIVE_MODE":
      const toggleLiveMode = {
        ...state,
        editor: {
          ...state.editor,
          liveMode: action.payload?.value || !state.editor.liveMode,
        },
      };

      return toggleLiveMode;

    case "TOGGLE_VISIBILITY_STATUS":
      const toggleVisibilityStatus = {
        ...state,
        editor: {
          ...state.editor,
          visible: action.payload?.value || !state.editor.visible,
        },
      };

      return toggleVisibilityStatus;

    case "REDO":
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        const nextEditorState = { ...state.history.history[nextIndex] };
        const redoState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        };
        return redoState;
      }
      return state;

    case "UNDO":
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1;
        const prevEditorState = { ...state.history.history[prevIndex] };
        const undoState = {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        };
        return undoState;
      }
      return state;

    case "SET_DESIGN_TOKENS":
      const updatedEditorStateWithTokens = {
        ...state.editor,
        designTokens: {
          fonts: {
            ...state.editor.designTokens.fonts,
            ...action.payload.fonts,
          },
          colors: {
            ...state.editor.designTokens.colors,
            ...action.payload.colors,
          },
        },
      };

      const updatedHistoryWithTokens = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithTokens },
      ];

      return {
        ...state,
        editor: updatedEditorStateWithTokens,
        history: {
          ...state.history,
          history: updatedHistoryWithTokens,
          currentIndex: updatedHistoryWithTokens.length - 1,
        },
      };

    case "LOAD_DATA":
      return {
        ...initialState,
        editor: {
          ...initialState.editor,
          elements: action.payload.elements || initialEditorState.elements,
          liveMode: !!action.payload.withLive,
          designTokens: (action.payload as any).designTokens || initialEditorState.designTokens,
        },
      };

    case "SET_SITE_ID":
      const { siteId } = action.payload;
      const updatedEditorStateWithSiteId = {
        ...state.editor,
        siteId,
      };

      const updatedHistoryWithSiteId = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithSiteId },
      ];

      const siteIdState = {
        ...state,
        editor: updatedEditorStateWithSiteId,
        history: {
          ...state.history,
          history: updatedHistoryWithSiteId,
          currentIndex: updatedHistoryWithSiteId.length - 1,
        },
      };

      return siteIdState;

    default:
      return initialState;
  }
};

export type EditorContextData = {
  device: DeviceTypes;
  previewMode: boolean;
  setPreviewMode: (previewMode: boolean) => void;
  setDevice: (device: DeviceTypes) => void;
};

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  siteId: string;
  siteDetails: Page | null;
}>({
  state: initialState,
  dispatch: () => undefined,
  siteId: "",
  siteDetails: null,
});

type EditorProps = {
  children: React.ReactNode;
  siteId: string;
  siteDetails: Page;
};

const EditorProvider = (props: EditorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        siteId: props.siteId,
        siteDetails: props.siteDetails,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor Hook must be used within the EditorProvider.");
  }

  return context;
};

export default EditorProvider;
