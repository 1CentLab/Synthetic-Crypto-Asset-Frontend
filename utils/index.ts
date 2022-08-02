export const convertAddressToDisplayValue = (address: string, lengthBeforeSlice = 9) => {
  if (address?.length < lengthBeforeSlice + 5) {
    return address;
  }
  return address ? address.slice(0, lengthBeforeSlice) + '...' + address.slice(address.length - 4, address.length) : '';
};
