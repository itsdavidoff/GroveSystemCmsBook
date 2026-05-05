"use client";

import { getSiteDetails } from "@/lib/actions/page";
import { useEditor } from "@/app/providers/editor-provider";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { ArrowLeft, EyeOff } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import Recursive from "./editor-components/recursive";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { getLink } from "@/lib/getLink";
import { upsertSite } from "@/lib/actions/page";
import { useDebounce } from "@/hooks/use-debounce";
import { useHotkeys } from "@/hooks/use-hotkeys";

type Props = { siteId: string; liveMode?: boolean };

function SiteEditor({ siteId, liveMode }: Props) {
  const { state, dispatch } = useEditor();
  const isMobile = useIsMobile();

  // Keyboard Shortcuts
  useHotkeys({
    "ctrl+z": () => dispatch({ type: "UNDO" }),
    "ctrl+y": () => dispatch({ type: "REDO" }),
    "ctrl+shift+z": () => dispatch({ type: "REDO" }),
    "ctrl+d": () => {
      if (state.editor.selectedElement.id) {
        dispatch({
          type: "DUPLICATE_ELEMENT",
          payload: { elementDetails: state.editor.selectedElement },
        });
      }
    },
    "delete": () => {
      if (state.editor.selectedElement.id && state.editor.selectedElement.type !== "__body") {
        dispatch({
          type: "DELETE_ELEMENT",
          payload: { elementDetails: state.editor.selectedElement },
        });
      }
    },
    "backspace": () => {
      // Only delete if not typing in a text field
      if (
        state.editor.selectedElement.id && 
        state.editor.selectedElement.type !== "__body" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        !(document.activeElement as HTMLElement)?.isContentEditable
      ) {
        dispatch({
          type: "DELETE_ELEMENT",
          payload: { elementDetails: state.editor.selectedElement },
        });
      }
    },
  });

  // Debounce the editor state to trigger auto-save
  const debouncedEditorState = useDebounce(state.editor.elements, 3000);

  useEffect(() => {
    if (liveMode) {
      dispatch({
        type: "TOGGLE_LIVE_MODE",
        payload: { value: true },
      });
    }
  }, [liveMode, dispatch]);

  // Auto-save effect
  useEffect(() => {
    const handleAutoSave = async () => {
      if (liveMode || state.editor.previewMode || !debouncedEditorState.length) return;
      
      try {
        const response = await upsertSite({
          id: siteId,
          content: JSON.stringify(debouncedEditorState),
          designTokens: JSON.stringify(state.editor.designTokens),
        } as any);
        
        if (response.success) {
          toast.success("Saved", { 
            description: "Changes saved automatically",
            duration: 1000 
          });
        }
      } catch (error) {
        console.error("Auto-save failed", error);
      }
    };

    handleAutoSave();
  }, [debouncedEditorState, siteId, liveMode, state.editor.previewMode]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSiteDetails(siteId);
      if (response.success === false) {
        toast.error("Error", { description: response.msg as string });
        return;
      }

      dispatch({
        type: "LOAD_DATA",
        payload: {
          elements: response.content ? JSON.parse(response?.content) : "",
          withLive: !!liveMode,
          designTokens: (response as any).designTokens ? JSON.parse((response as any).designTokens) : undefined,
        } as any,
      });
    };
    fetchData();
  }, [siteId, dispatch, liveMode]);

  if (isMobile && !liveMode && !state.editor.previewMode) {
    return (
      <div className="flex flex-col gap-4 px-4 absolute z-[101] top-0 w-screen h-screen items-center justify-center">
        <h1 className="text-2xl text-center">
          Whoops! The Framely Website Editor is only available on larger
          devices.
        </h1>
        <Button asChild variant="link" className="group">
          <Link href={getLink({})}>
            <ArrowLeft /> Go Back
          </Link>
        </Button>
      </div>
    );
  }
  const handleClick = () => {
    dispatch({ type: "CHANGE_SELECTED_ELEMENT", payload: {} });
  };

  const handleUnPreview = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };

  return (
    <div
      className={`h-full overflow-y-scroll max-w-full overflow-x-clip bg-muted ${state.editor.previewMode === false && state.editor.liveMode === false && "max-h-[calc(100vh-65px)]"}`}
    >
      <div
        className={clsx(
          "use-animation-zoom-in h-full bg-muted transition-all rounded-none py-12 px-20 w-full flex justify-center relative",
          {
            "!p-0 !m-0 min-w-screen min-h-screen":
              state.editor.previewMode === true ||
              state.editor.liveMode === true,
          }
        )}
        onClick={handleClick}
      >
        <Button
          variant="default"
          size="icon"
          onClick={handleUnPreview}
          className={`absolute top-5 right-5 w-12 h-12 rounded-lg z-[500] shadow-lg flex items-center justify-center transition-all duration-300 transform ${
            state.editor.previewMode
              ? "translate-x-0 opacity-100"
              : "translate-x-20 opacity-0"
          }`}
        >
          <EyeOff />
        </Button>
        {Array.isArray(state.editor.elements) &&
          state.editor.elements.map((childElement) => (
            <Recursive key={childElement.id} element={childElement} />
          ))}
      </div>
    </div>
  );
}

export default SiteEditor;
