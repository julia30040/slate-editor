import PropTypes from "prop-types";
import React, { useRef, useState, useEffect } from "react";
import FontAwesome from "react-fontawesome";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { Range, Element, Node } from "slate";
import { useSlateSelection, useSlate } from "slate-react";

// import Tooltip from '../Tooltip';
import { shortenHref } from "../utils/format";

import { ZINDEX, opacity, color, component } from "../styles/theme";

const StyledLinkMenu = styled.div`
  display: none;
  /* display: block; */
  position: absolute;
  margin-left: 15px;
  margin-top: 8px;
  z-index: ${ZINDEX.slate_hovering_menu};

  .arrow-top {
    position: absolute;
    bottom: calc(100% - 1px);
    left: 25px;
    margin-left: -5px;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, ${opacity.low})
      transparent;
  }

  .arrow-top::after {
    content: "";
    position: absolute;
    left: -4px;
    bottom: -6px;
    border-width: 4px;
    border-style: solid;
    border-color: transparent transparent white;
  }

  * {
    display: inline-block;
  }

  .href {
    color: ${color.gray.dark};
    border-bottom: none;
  }

  .menu-button {
    color: ${color.gray.dark};
    background-color: transparent;
    border: 1px solid rgba(0, 0, 0, ${opacity.low});
    border-radius: 3px;
    &:hover {
      background-color: ${color.gray.lighter};
    }
    &:not(:first-child) {
      border-left: none;
    }
  }

  .menu-container {
    padding: 6px 8px 5px;
    color: rgba(0, 0, 0, ${opacity.high});
    background-color: #fff;
    border-radius: ${component.border.radius.lg};
    border: 1px solid rgba(0, 0, 0, ${opacity.low});
    transition: opacity 0.75s;

    a {
      color: ${color.gray.dark};
      border-bottom: none;
    }
  }
`;

const LinkMenu = ({ menuRef, href, id, onOpenEditDialog, onRemoveLink }) => (
  <StyledLinkMenu ref={menuRef} contentEditable={false}>
    <div className="menu-container">
      <div className="arrow-top" />
      <a
        style={{ marginRight: "10px", marginLeft: "5px" }}
        spellCheck="false"
        href={href}
        target="_blank"
      >
        {shortenHref(href)}
      </a>
      <div>
        <button
          type="button"
          className="menu-button"
          onMouseDown={onOpenEditDialog}
          data-for={`edit-link-btn-${id}`}
          data-tip
        >
          <FontAwesome name="link" />
        </button>
        {/*<Tooltip id={`edit-link-btn-${id}`} position="bottom">編輯連結</Tooltip>*/}
        <button
          type="button"
          className="menu-button"
          onMouseDown={onRemoveLink}
          data-for={`remove-link-btn-${id}`}
          data-tip
        >
          <FontAwesome name="unlink" />
        </button>
        {/*<Tooltip id={`remove-link-btn-${id}`} position="bottom">移除連結</Tooltip>*/}
      </div>
    </div>
  </StyledLinkMenu>
);

LinkMenu.propTypes = {
  menuRef: PropTypes.func.isRequired,
  href: PropTypes.string,
  id: PropTypes.string.isRequired,
  onOpenEditDialog: PropTypes.func.isRequired,
  onRemoveLink: PropTypes.func.isRequired,
};

LinkMenu.defaultProps = {
  href: "",
};

const Link = ({
  node,
  attributes,
  children,
  onOpenEditDialog,
  onRemoveLink,
}) => {
  const linkRef = useRef();
  const menuRef = useRef();
  const [id] = useState(() => nanoid());

  const editor = useSlate();
  const { selection, children: rootNode } = editor;
  const selectionAncestor = selection
    ? Node.parent(editor, selection?.anchor?.path)
    : null;
  console.log({ node, selectionAncestor });
  const isSelected =
    !!selectionAncestor && Element.matches(node, selectionAncestor);
  console.log({ isSelected });

  useEffect(() => {
    updateMenu();
  }, [isSelected]);

  const updateMenu = () => {
    if (!menuRef) return;
    const menuElement = menuRef.current;

    if (isSelected && selection && Range.isCollapsed(selection)) {
      if (!linkRef) return;
      menuElement.style.display = "block";
    } else {
      menuElement.style.display = "none";
    }
  };

  const closeMenu = () => {
    menuRef.current.style.display = "none";
  };

  const { href, target } = node;
  return (
    <span>
      <a ref={linkRef} {...attributes} href={href} target={target}>
        {children}
      </a>
      <LinkMenu
        menuRef={menuRef}
        href={href}
        id={id}
        onOpenEditDialog={() => {
          setTimeout(() => {
            onOpenEditDialog?.();
          });
        }}
        onRemoveLink={onRemoveLink}
      />
    </span>
  );
};

export default Link;
