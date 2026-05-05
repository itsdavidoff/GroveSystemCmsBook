"use client";
import { EditorElement, useEditor } from "@/app/providers/editor-provider";
import { Badge } from "@/components/ui/badge";
import { defaultStyles, ElementTypes } from "@/lib/constants";
import { createId } from "@paralleldrive/cuid2";
import clsx from "clsx";
import Recursive from "./recursive";
import { Trash } from "lucide-react";
import { useState } from "react";

type Props = { element: EditorElement };

function Container({ element }: Props) {
  const { id, content, name, styles, type } = element;
  const { state, dispatch } = useEditor();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const isSelected = state.editor.selectedElement.id === id;

  // Extract custom CSS from styles
  const { cssText, ...inlineStyles } = styles as any;
  const customStyles: React.CSSProperties = { ...inlineStyles };

  if (cssText) {
    const lines = cssText.split(";");
    lines.forEach((line: string) => {
      const [prop, value] = line.split(":");
      if (prop && value) {
        const camelProp = prop
          .trim()
          .replace(/-([a-z])/g, (g: any) => g[1].toUpperCase());
        (customStyles as any)[camelProp] = value.trim();
      }
    });
  }

  const handleOnDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDraggingOver(false);
    const componentType = e.dataTransfer.getData(
      "componentType"
    ) as ElementTypes;
    switch (componentType) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: `Heading ${componentType.charAt(1)}`,
              },
              id: createId(),
              name: `Heading ${componentType.charAt(1)}`,
              styles: {
                color: "black",
                ...defaultStyles,
                fontSize:
                  componentType === "h1"
                    ? "2.5rem"
                    : componentType === "h2"
                      ? "2rem"
                      : componentType === "h3"
                        ? "1.75rem"
                        : componentType === "h4"
                          ? "1.5rem"
                          : componentType === "h5"
                            ? "1.25rem"
                            : "1rem",
                fontWeight:
                  componentType === "h1" || componentType === "h2"
                    ? "700"
                    : "600",
                lineHeight: "1.2",
                marginBottom: "0.5rem",
              },
              type: componentType,
              category: "Text",
            },
          },
        });
        break;
      case "p":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Paragraph",
              },
              id: createId(),
              name: "Paragraph",
              styles: {
                color: "black",
                ...defaultStyles,
                fontSize: "1rem",
                lineHeight: "1.5",
                marginBottom: "1rem",
              },
              type: componentType,
              category: "Text",
            },
          },
        });
        break;
      case "span":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Text",
              },
              id: createId(),
              name: "Text",
              styles: {
                color: "black",
                ...defaultStyles,
                fontSize: "1rem",
                display: "inline",
              },
              type: componentType,
              category: "Text",
            },
          },
        });
        break;
      case "image":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                imageUrl: undefined,
                altText: undefined,
              },
              id: createId(),
              name: "Image",
              styles: {},
              type: componentType,
              category: "Basic",
            },
          },
        });
        break;
      case "container":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: createId(),
              name: "Container",
              styles: {
                ...defaultStyles,
              },
              type: "container",
              category: "Container",
            },
          },
        });
        break;
      case "2Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: createId(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                  category: "Container",
                },
                {
                  content: [],
                  id: createId(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                  category: "Container",
                },
              ],
              id: createId(),
              name: "Two Columns",
              styles: {
                ...defaultStyles,
                display: "flex",
              },
              type: "2Col",
              category: "Container",
            },
          },
        });
        break;
      case "3Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: createId(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                  category: "Container",
                },
                {
                  content: [],
                  id: createId(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                  category: "Container",
                },
                {
                  content: [],
                  id: createId(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                  category: "Container",
                },
              ],
              id: createId(),
              name: "Three Columns",
              styles: {
                ...defaultStyles,
                display: "flex",
              },
              type: "3Col",
              category: "Container",
            },
          },
        });
        break;
      case "navbar":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: { innerText: "Logo" },
                  id: createId(),
                  name: "Logo",
                  styles: { ...defaultStyles, fontWeight: "bold", fontSize: "1.2rem" },
                  type: "span",
                  category: "Text",
                },
                {
                  content: [
                    {
                      content: { innerText: "Home", href: "#" },
                      id: createId(),
                      name: "Nav Link",
                      styles: { ...defaultStyles, padding: "0 10px" },
                      type: "link",
                      category: "Link",
                    },
                    {
                      content: { innerText: "About", href: "#" },
                      id: createId(),
                      name: "Nav Link",
                      styles: { ...defaultStyles, padding: "0 10px" },
                      type: "link",
                      category: "Link",
                    },
                    {
                      content: { innerText: "Contact", href: "#" },
                      id: createId(),
                      name: "Nav Link",
                      styles: { ...defaultStyles, padding: "0 10px" },
                      type: "link",
                      category: "Link",
                    },
                  ],
                  id: createId(),
                  name: "Nav Links",
                  styles: { ...defaultStyles, display: "flex", marginLeft: "auto" },
                  type: "container",
                  category: "Container",
                },
              ],
              id: createId(),
              name: "Navbar",
              styles: {
                ...defaultStyles,
                display: "flex",
                alignItems: "center",
                padding: "20px",
                width: "100%",
                backgroundColor: "white",
                borderBottom: "1px solid #eaeaea",
              },
              type: "navbar",
              category: "Container",
            },
          },
        });
        break;
      case "hero":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: { innerText: "Amazing Hero Title" },
                  id: createId(),
                  name: "Hero Title",
                  styles: { ...defaultStyles, fontSize: "3rem", fontWeight: "800", marginBottom: "1rem", textAlign: "center" },
                  type: "h1",
                  category: "Text",
                },
                {
                  content: { innerText: "Build your dream website with our powerful drag-and-drop editor." },
                  id: createId(),
                  name: "Hero Subtitle",
                  styles: { ...defaultStyles, fontSize: "1.2rem", color: "#666", marginBottom: "2rem", textAlign: "center" },
                  type: "p",
                  category: "Text",
                },
                {
                  content: { innerText: "Get Started", href: "#" },
                  id: createId(),
                  name: "CTA Button",
                  styles: { 
                    ...defaultStyles, 
                    backgroundColor: "black", 
                    color: "white", 
                    padding: "12px 24px", 
                    borderRadius: "8px",
                    display: "inline-block"
                  },
                  type: "link",
                  category: "Link",
                },
              ],
              id: createId(),
              name: "Hero Section",
              styles: {
                ...defaultStyles,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 20px",
                width: "100%",
                backgroundColor: "#f9f9f9",
              },
              type: "hero",
              category: "Container",
            },
          },
        });
        break;
      case "pricing":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: { innerText: "Simple Pricing" },
                  id: createId(),
                  name: "Title",
                  styles: { ...defaultStyles, fontSize: "2.5rem", fontWeight: "bold", marginBottom: "3rem", textAlign: "center", width: "100%" },
                  type: "h2",
                  category: "Text",
                },
                {
                  content: [
                    // Tier 1
                    {
                      content: [
                        { content: { innerText: "Basic" }, id: createId(), name: "Tier", styles: { fontWeight: "bold" }, type: "span", category: "Text" },
                        { content: { innerText: "$9/mo" }, id: createId(), name: "Price", styles: { fontSize: "2rem", fontWeight: "800", margin: "10px 0" }, type: "h3", category: "Text" },
                        { content: { innerText: "Best for individuals" }, id: createId(), name: "Desc", styles: { color: "#666", fontSize: "0.9rem" }, type: "p", category: "Text" },
                      ],
                      id: createId(),
                      name: "Card",
                      styles: { ...defaultStyles, padding: "30px", border: "1px solid #eee", borderRadius: "12px", flex: "1", margin: "0 10px", backgroundColor: "white" },
                      type: "container",
                      category: "Container",
                    },
                    // Tier 2
                    {
                      content: [
                        { content: { innerText: "Pro" }, id: createId(), name: "Tier", styles: { fontWeight: "bold", color: "white" }, type: "span", category: "Text" },
                        { content: { innerText: "$29/mo" }, id: createId(), name: "Price", styles: { fontSize: "2rem", fontWeight: "800", margin: "10px 0", color: "white" }, type: "h3", category: "Text" },
                        { content: { innerText: "Best for teams" }, id: createId(), name: "Desc", styles: { color: "#ccc", fontSize: "0.9rem" }, type: "p", category: "Text" },
                      ],
                      id: createId(),
                      name: "Card Pro",
                      styles: { ...defaultStyles, padding: "30px", border: "1px solid #000", borderRadius: "12px", flex: "1", margin: "0 10px", backgroundColor: "black", color: "white" },
                      type: "container",
                      category: "Container",
                    },
                  ],
                  id: createId(),
                  name: "Pricing Grid",
                  styles: { ...defaultStyles, display: "flex", justifyContent: "center", width: "100%" },
                  type: "container",
                  category: "Container",
                }
              ],
              id: createId(),
              name: "Pricing Section",
              styles: { ...defaultStyles, padding: "80px 20px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },
              type: "container",
              category: "Container",
            },
          },
        });
        break;
      case "faq":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: { innerText: "Frequently Asked Questions" },
                  id: createId(),
                  name: "FAQ Title",
                  styles: { ...defaultStyles, fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem", textAlign: "center", width: "100%" },
                  type: "h2",
                  category: "Text",
                },
                {
                  content: [
                    {
                      content: [
                        { content: { innerText: "What is Framely?" }, id: createId(), name: "Question", styles: { fontWeight: "bold", marginBottom: "0.5rem" }, type: "p", category: "Text" },
                        { content: { innerText: "Framely is the most powerful no-code website builder for modern teams." }, id: createId(), name: "Answer", styles: { color: "#666" }, type: "p", category: "Text" },
                      ],
                      id: createId(),
                      name: "FAQ Item",
                      styles: { ...defaultStyles, padding: "20px", borderBottom: "1px solid #eee", width: "100%" },
                      type: "container",
                      category: "Container",
                    },
                    {
                      content: [
                        { content: { innerText: "How does it work?" }, id: createId(), name: "Question", styles: { fontWeight: "bold", marginBottom: "0.5rem" }, type: "p", category: "Text" },
                        { content: { innerText: "Simply drag and drop elements, customize them, and hit publish!" }, id: createId(), name: "Answer", styles: { color: "#666" }, type: "p", category: "Text" },
                      ],
                      id: createId(),
                      name: "FAQ Item",
                      styles: { ...defaultStyles, padding: "20px", borderBottom: "1px solid #eee", width: "100%" },
                      type: "container",
                      category: "Container",
                    },
                  ],
                  id: createId(),
                  name: "FAQ List",
                  styles: { ...defaultStyles, width: "100%", maxWidth: "800px" },
                  type: "container",
                  category: "Container",
                }
              ],
              id: createId(),
              name: "FAQ Section",
              styles: { ...defaultStyles, padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", backgroundColor: "white" },
              type: "container",
              category: "Container",
            },
          },
        });
        break;
      case "contactForm":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: { innerText: "Get in Touch" },
                  id: createId(),
                  name: "Form Title",
                  styles: { ...defaultStyles, fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", textAlign: "center", width: "100%" },
                  type: "h2",
                  category: "Text",
                },
                {
                  content: { innerText: "We'd love to hear from you. Please fill out the form below." },
                  id: createId(),
                  name: "Form Subtitle",
                  styles: { ...defaultStyles, color: "#666", marginBottom: "2rem", textAlign: "center", width: "100%" },
                  type: "p",
                  category: "Text",
                },
                {
                  content: [
                    {
                      content: [
                        { content: { innerText: "Name" }, id: createId(), name: "Label", styles: { fontSize: "0.8rem", fontWeight: "bold", marginBottom: "0.4rem" }, type: "p", category: "Text" },
                        { content: { innerText: "Your Name" }, id: createId(), name: "Input Placeholder", styles: { padding: "10px", border: "1px solid #ddd", borderRadius: "6px", width: "100%", backgroundColor: "#fff" }, type: "p", category: "Text" },
                      ],
                      id: createId(),
                      name: "Input Group",
                      styles: { ...defaultStyles, marginBottom: "1rem", width: "100%" },
                      type: "container",
                      category: "Container",
                    },
                    {
                      content: [
                        { content: { innerText: "Email" }, id: createId(), name: "Label", styles: { fontSize: "0.8rem", fontWeight: "bold", marginBottom: "0.4rem" }, type: "p", category: "Text" },
                        { content: { innerText: "hello@example.com" }, id: createId(), name: "Input Placeholder", styles: { padding: "10px", border: "1px solid #ddd", borderRadius: "6px", width: "100%", backgroundColor: "#fff" }, type: "p", category: "Text" },
                      ],
                      id: createId(),
                      name: "Input Group",
                      styles: { ...defaultStyles, marginBottom: "1rem", width: "100%" },
                      type: "container",
                      category: "Container",
                    },
                    {
                      content: { innerText: "Send Message" },
                      id: createId(),
                      name: "Submit Button",
                      styles: { ...defaultStyles, backgroundColor: "black", color: "white", padding: "12px", borderRadius: "6px", textAlign: "center", width: "100%", fontWeight: "bold", cursor: "pointer" },
                      type: "p",
                      category: "Text",
                    },
                  ],
                  id: createId(),
                  name: "Form Container",
                  styles: { ...defaultStyles, width: "100%", maxWidth: "500px", padding: "30px", backgroundColor: "#f9f9f9", borderRadius: "12px", border: "1px solid #eee" },
                  type: "container",
                  category: "Container",
                }
              ],
              id: createId(),
              name: "Contact Section",
              styles: { ...defaultStyles, padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" },
              type: "container",
              category: "Container",
            },
          },
        });
        break;
      case "testimonials":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: { innerText: "What our customers say" },
                  id: createId(),
                  name: "Title",
                  styles: { ...defaultStyles, fontSize: "2.5rem", fontWeight: "bold", marginBottom: "3rem", textAlign: "center", width: "100%" },
                  type: "h2",
                  category: "Text",
                },
                {
                  content: [
                    {
                      content: [
                        { content: { innerText: "★★★★★" }, id: createId(), name: "Stars", styles: { color: "#ffc107", marginBottom: "1rem" }, type: "p", category: "Text" },
                        { content: { innerText: "This editor changed my life. Building sites is now fun!" }, id: createId(), name: "Quote", styles: { fontStyle: "italic", marginBottom: "1.5rem" }, type: "p", category: "Text" },
                        { content: { innerText: "John Doe, Designer" }, id: createId(), name: "Author", styles: { fontWeight: "bold", fontSize: "0.9rem" }, type: "p", category: "Text" },
                      ],
                      id: createId(),
                      name: "Review Card",
                      styles: { ...defaultStyles, padding: "30px", backgroundColor: "white", borderRadius: "16px", border: "1px solid #eee", flex: "1", margin: "0 10px" },
                      type: "container",
                      category: "Container",
                    },
                    {
                      content: [
                        { content: { innerText: "★★★★★" }, id: createId(), name: "Stars", styles: { color: "#ffc107", marginBottom: "1rem" }, type: "p", category: "Text" },
                        { content: { innerText: "Finally a tool that understands what we need as developers." }, id: createId(), name: "Quote", styles: { fontStyle: "italic", marginBottom: "1.5rem" }, type: "p", category: "Text" },
                        { content: { innerText: "Jane Smith, CTO" }, id: createId(), name: "Author", styles: { fontWeight: "bold", fontSize: "0.9rem" }, type: "p", category: "Text" },
                      ],
                      id: createId(),
                      name: "Review Card",
                      styles: { ...defaultStyles, padding: "30px", backgroundColor: "white", borderRadius: "16px", border: "1px solid #eee", flex: "1", margin: "0 10px" },
                      type: "container",
                      category: "Container",
                    },
                  ],
                  id: createId(),
                  name: "Testimonials Grid",
                  styles: { ...defaultStyles, display: "flex", width: "100%", justifyContent: "center" },
                  type: "container",
                  category: "Container",
                }
              ],
              id: createId(),
              name: "Testimonials Section",
              styles: { ...defaultStyles, padding: "80px 20px", backgroundColor: "#fbfbfb", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },
              type: "container",
              category: "Container",
            },
          },
        });
        break;
      case "footer":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [
                    {
                      content: [
                        { content: { innerText: "Framely" }, id: createId(), name: "Brand", styles: { fontWeight: "bold", fontSize: "1.2rem", marginBottom: "0.5rem" }, type: "span", category: "Text" },
                        { content: { innerText: "The future of no-code." }, id: createId(), name: "Slogan", styles: { color: "#666", fontSize: "0.8rem" }, type: "p", category: "Text" },
                      ],
                      id: createId(),
                      name: "Brand Info",
                      styles: { ...defaultStyles, flex: "1" },
                      type: "container",
                      category: "Container",
                    },
                    {
                      content: [
                        { content: { innerText: "Product", href: "#" }, id: createId(), name: "Link", styles: { fontSize: "0.8rem", marginBottom: "0.5rem", display: "block" }, type: "link", category: "Link" },
                        { content: { innerText: "Pricing", href: "#" }, id: createId(), name: "Link", styles: { fontSize: "0.8rem", marginBottom: "0.5rem", display: "block" }, type: "link", category: "Link" },
                      ],
                      id: createId(),
                      name: "Links Group",
                      styles: { ...defaultStyles, flex: "1" },
                      type: "container",
                      category: "Container",
                    },
                  ],
                  id: createId(),
                  name: "Footer Content",
                  styles: { ...defaultStyles, display: "flex", width: "100%", maxWidth: "1200px" },
                  type: "container",
                  category: "Container",
                },
                {
                  content: { innerText: "© 2026 Framely Inc. All rights reserved." },
                  id: createId(),
                  name: "Copyright",
                  styles: { ...defaultStyles, borderTop: "1px solid #eee", paddingTop: "20px", marginTop: "40px", fontSize: "0.7rem", color: "#999", textAlign: "center", width: "100%" },
                  type: "p",
                  category: "Text",
                }
              ],
              id: createId(),
              name: "Footer",
              styles: { ...defaultStyles, padding: "60px 20px", backgroundColor: "#fff", borderTop: "1px solid #eee", width: "100%" },
              type: "container",
              category: "Container",
            },
          },
        });
        break;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_SELECTED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({ type: "DELETE_ELEMENT", payload: { elementDetails: element } });
  };

  return (
    <div
      className={clsx("relative group my-1", {
        "max-w-full w-full":
          (type === "container" || type === "2Col" || type === "3Col") && !styles?.width,
        "h-fit": type === "container" && !styles?.height,
        "h-full": type === "__body",
        "!h-screen !m-0 !rounded-none":
          type === "__body" && state.editor.liveMode,
        "flex flex-col md:!flex-row": type === "2Col" || type === "3Col",
        "!w-[350px]": type === "__body" && state.editor.device === "Mobile",
        "!w-[800px]": type === "__body" && state.editor.device === "Tablet",
        "!w-full": type === "__body" && state.editor.device === "Desktop",
        "transition-[width,height]": type == "__body",
        "!outline-blue-500 !outline-2":
          isSelected &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body" &&
          !isDraggingOver,
        "!outline-yellow-400 !outline-4":
          isSelected &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "!outline-yellow-400 !outline-solid !outline-2": isDraggingOver,
        "!outline-4": isDraggingOver && type === "__body",
        "!outline-solid": isSelected && !state.editor.liveMode,
        "outline-dashed outline-[1px] outline-slate-300":
          !state.editor.liveMode,
      })}
      style={customStyles}
      onDrop={(e) => {
        handleOnDrop(e);
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragStart={(e) => handleDragStart(e, "container")}
      onClick={handleOnClickBody}
    >
      <Badge
        className={clsx(
          "absolute -top-[24px] -left-[1px] rounded-none rounded-t-lg hidden cursor-default bg-primary text-primary-foreground dark:bg-background dark:text-foreground",
          {
            block: isSelected && !state.editor.liveMode,
          }
        )}
      >
        {name}
      </Badge>

      <div
        style={{ ...styles, width: undefined, height: undefined, cssText: undefined } as any}
        onDragLeave={handleDragLeave}
        onDrop={handleOnDrop}
      >
        {isDraggingOver && (
          <div className="absolute inset-x-0 top-0 h-1 bg-blue-500 z-50 animate-pulse pointer-events-none" />
        )}
        {Array.isArray(content) &&
          content.map((childElement) => (
            <Recursive key={childElement.id} element={childElement} />
          ))}
      </div>

      {isSelected &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[26px] -right-[1px] rounded-none rounded-t-lg dark:bg-background">
            <Trash
              className="cursor-pointer text-primary-foreground dark:text-foreground"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
}

export default Container;
