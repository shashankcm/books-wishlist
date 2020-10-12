export const randomNumber = () => Math.floor(1000 + Math.random() * 9000);

export const removeDuplicates = (inputArray: any[]) =>
  inputArray.filter((ele, index) => {
    const jsonEle = JSON.stringify(ele);
    return (
      index ===
      inputArray.findIndex((obj) => {
        return JSON.stringify(obj) === jsonEle;
      })
    );
  });

export const removedDuplicatesArrayLength = (inputArray: any[]) => {
  return removeDuplicates(inputArray).length;
};

export const cancelableDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timeoutId: any = 0,
    handler: any = null;

  const debounce = (...args: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    handler = () => {
      handler = null;
      func(...args);
    };

    timeoutId = setTimeout(handler, delay);
  };

  debounce.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = 0;
    handler = null;
  };

  debounce.flush = () => {
    clearTimeout(timeoutId);
    timeoutId = 0;

    if (handler) {
      handler();
    }
  };

  return debounce;
};
