import { useCallback, useEffect } from "react";
import { DebounceCleanupAction, CancelableDebounced } from "./types";
import { cancelableDebounce } from "./utils";

export const useDebouncedFunction = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  cleanupAction: DebounceCleanupAction
): CancelableDebounced<T> => {
  const debounced = useCallback(cancelableDebounce(callback, delay), []);
  useEffect(
    () => () => {
      if (cleanupAction === DebounceCleanupAction.Cancel) {
        debounced.cancel();
      } else {
        debounced.flush();
      }
    },
    [cleanupAction, debounced]
  );

  return debounced;
};
