"use client";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getDigitScript,
  initDigitScriptFromStorage,
  setDigitScript,
  subscribeDigitScript,
} from "@/lib/utils";
import { formatDigits, type DigitScript } from "@/lib/digits";

export function useDigitScript(): DigitScript {
  return useSyncExternalStore(subscribeDigitScript, getDigitScript, () => "en");
}
/** Compatibility name: changing the digit preference never remounts children. */
export function DigitRemount({ children }: { children: ReactNode }) {
  useEffect(() => {
    initDigitScriptFromStorage();
    const sync = (event: StorageEvent) => {
      if (event.key === "sufi-digits")
        setDigitScript(event.newValue === "fa" ? "fa" : "en", false);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return children;
}
function localize(node: ReactNode, script: DigitScript): ReactNode {
  if (typeof node === "string" || typeof node === "number")
    return formatDigits(node, script);
  if (Array.isArray(node))
    return Children.map(node, (child) => localize(child, script));
  if (
    !isValidElement<{ children?: ReactNode; "data-digit-literal"?: boolean }>(
      node,
    )
  )
    return node;
  const type = node.type as { preserveDigitSource?: boolean };
  if (
    type.preserveDigitSource ||
    node.props["data-digit-literal"] ||
    (typeof node.type === "string" &&
      ["script", "style", "code", "pre", "textarea"].includes(node.type))
  )
    return node;
  if (node.props.children === undefined) return node;
  return cloneElement(node, undefined, localize(node.props.children, script));
}
/** Pure React text formatting: attributes, numeric inputs, and component state stay intact. */
export function LocalizedDigits({ children }: { children: ReactNode }) {
  const script = useDigitScript();
  return localize(children, script);
}
