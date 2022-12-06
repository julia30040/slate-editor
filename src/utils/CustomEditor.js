import {
  Editor,
  Transforms,
  Text,
  Element as SlateElement,
  Range,
} from "slate";

export const DEFAULT_NODE = "paragraph";
export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
const BLOCK_TYPES = ["link", "pre"].concat(LIST_TYPES);

export const CustomEditor = {
  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },
  toggleMark(editor, format) {
    const isActive = CustomEditor.isMarkActive(editor, format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },
  isBlockActive(editor, format, blockType = "type") {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n[blockType] === format,
      })
    );

    return !!match;
  },
  toggleBlock(editor, format) {
    const isActive = CustomEditor.isBlockActive(
      editor,
      format,
      TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
    );
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes(n.type) &&
        !TEXT_ALIGN_TYPES.includes(format),
      split: true,
    });
    let newProperties; // Partial<SlateElement>
    if (TEXT_ALIGN_TYPES.includes(format)) {
      newProperties = {
        align: isActive ? undefined : format,
      };
    } else {
      newProperties = {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
      };
    }
    Transforms.setNodes(editor, newProperties); //< SlateElement >

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  },
  clearFormat(editor) {
    Editor.removeMark(editor, "bold");
    Editor.removeMark(editor, "italic");

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        (n.children?.every((child) => Editor.isBlock(editor, child)) ||
          n.type === "link"),
      mode: "all", // also the Editor's children
      split: true,
    });
    Transforms.setNodes(editor, { type: DEFAULT_NODE });
  },
  addLink(editor, { href, text, openInNewWindow }) {
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link = {
      type: "link",
      href,
      target: openInNewWindow ? "_blank" : "_self",
      children: isCollapsed ? [{ text }] : [],
    };

    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: "end" });
    }
  },
  updateLink(editor, { href, openInNewWindow }) {
    debugger;
    Transforms.setNodes(
      editor,
      {
        href,
        openInNewWindow,
      },
      {
        // 這邊的 n 會是從最外層一路到 selection 中的 node
        match: (n) =>
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
      }
    ); //< SlateElement >
  },
  removeLink(editor) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
    });
  },
  // toggleBoldMark(editor) {
  //   const isActive = CustomEditor.isMarkActive(editor, "bold");
  //   Transforms.setNodes(
  //     editor,
  //     { bold: isActive ? null : true },
  //     { match: (n) => Text.isText(n), split: true }
  //   );
  // },
  // toggleCodeBlock(editor) {
  //   const isActive = CustomEditor.isMarkActive(editor, "pre");
  //   Transforms.setNodes(
  //     editor,
  //     { type: isActive ? null : "pre" },
  //     { match: (n) => Editor.isBlock(editor, n) }
  //   );
  // },
};
