import { EditorElement, useEditor } from "@/app/providers/editor-provider";
import { Badge } from "@/components/ui/badge";
import { defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import { Trash, Copy, ArrowUp, ArrowDown } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  element: EditorElement;
  children: React.ReactNode;
  className?: string;
};

function ElementWrapper({ element, children, className }: Props) {
  const { state, dispatch } = useEditor();
  const [mounted, setMounted] = useState(false);
  const isSelected = state.editor.selectedElement.id === element.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeleteElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "DELETE_ELEMENT", payload: { elementDetails: element } });
  };

  const handleDuplicateElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "DUPLICATE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "MOVE_ELEMENT_UP",
      payload: { elementId: element.id },
    });
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "MOVE_ELEMENT_DOWN",
      payload: { elementId: element.id },
    });
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_SELECTED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  return (
    <div
      style={{
        width: element.styles.width || "auto",
        height: element.styles.height || "auto",
      }}
      className={clsx(className, "relative p-0", {
        "!border-blue-500 !border-2":
          isSelected &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4":
          isSelected &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "!border-solid": isSelected && !state.editor.liveMode,
        // "border-solid border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onClick={handleOnClickBody}
    >
      {mounted && isSelected && !state.editor.liveMode && (
        <Badge
          className={clsx(
            "absolute -top-[24px] -left-[1px] rounded-none rounded-t-lg bg-primary text-primary-foreground dark:bg-background dark:text-foreground",
          )}
          style={defaultStyles}
        >
          {element.name}
        </Badge>
      )}

      <div className="overflow-hidden">{children}</div>

      {mounted &&
        isSelected &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className="absolute flex gap-1 -top-[26px] -right-[1px] z-[10]">
            <div className="bg-primary px-2 py-1 rounded-t-lg dark:bg-background">
              <ArrowUp
                className="cursor-pointer text-primary-foreground dark:text-foreground"
                size={14}
                onClick={handleMoveUp}
              />
            </div>
            <div className="bg-primary px-2 py-1 rounded-t-lg dark:bg-background">
              <ArrowDown
                className="cursor-pointer text-primary-foreground dark:text-foreground"
                size={14}
                onClick={handleMoveDown}
              />
            </div>
            <div className="bg-primary px-2 py-1 rounded-t-lg dark:bg-background">
              <Copy
                className="cursor-pointer text-primary-foreground dark:text-foreground"
                size={14}
                onClick={handleDuplicateElement}
              />
            </div>
            <div className="bg-primary px-2 py-1 rounded-t-lg dark:bg-background">
              <Trash
                className="cursor-pointer text-primary-foreground dark:text-foreground"
                size={14}
                onClick={handleDeleteElement}
              />
            </div>
          </div>
        )}
    </div>
  );
}

export default ElementWrapper;
