import * as React from "react";

/**
 * Merges multiple refs into one callback ref, so a component can forward a
 * ref to its own internal use (measuring, focus) while still handing the
 * element to whatever ref the caller passed in.
 */
export function composeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref != null) {
        (ref as React.RefObject<T | null>).current = node;
      }
    }
  };
}

export function useComposedRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  // Plain function, recreated each render — ref callbacks are cheap and this
  // avoids fighting the stricter react-hooks/exhaustive-deps rule over a
  // spread dependency array.
  return composeRefs(...refs);
}
