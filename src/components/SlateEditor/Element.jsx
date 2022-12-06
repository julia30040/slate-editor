import React from "react";
import { editorJoiSchema } from "../../utils/validator";
import Link from "../Link";

export const Element = ({
  attributes,
  children,
  element,
  onEditDialogOpen,
}) => {
  const style = { textAlign: element.align };
  console.log({ element, attributes, children });

  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    // case "heading-one":
    //   return (
    //     <h1 style={style} {...attributes}>
    //       {children}
    //     </h1>
    //   );
    // case "heading-two":
    //   return (
    //     <h2 style={style} {...attributes}>
    //       {children}
    //     </h2>
    //   );
    case "heading-four":
      return <h4 {...attributes}>{children}</h4>;
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "pre":
      return <pre {...attributes}>{children}</pre>;
    case "link":
      return (
        <Link
          node={element}
          attributes={attributes}
          isSelected={true}
          onOpenEditDialog={() => {
            onEditDialogOpen({
              type: "edit-link",
              initialValues: {
                showTextInput: false,
                dialogUrl: element.href,
                openInNewWindow: element.target === "_blank",
              },
            });
          }}
          onRemoveLink={() => {}}
        >
          {children}
        </Link>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};
