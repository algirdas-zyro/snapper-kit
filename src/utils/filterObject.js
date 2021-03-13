export const filterObject = (objectToFilter, filterFunction) =>
  Object.fromEntries(
    Object.entries(objectToFilter).filter(([key, value], index, array) =>
      filterFunction({
        key,
        value,
        index,
        array,
      })
    )
  );
