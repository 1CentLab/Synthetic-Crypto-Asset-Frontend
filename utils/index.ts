import BigNumber from 'bignumber.js';

export const convertAddressToDisplayValue = (address: string, lengthBeforeSlice = 9) => {
  if (address?.length < lengthBeforeSlice + 5) {
    return address;
  }
  return address ? address.slice(0, lengthBeforeSlice) + '...' + address.slice(address.length - 4, address.length) : '';
};
export const STATUS_BALANCE = {
  InsufficentBalance: ' Insufficent Balance',
  Approve: 'Approve',
  SUBMIT: 'Submit',
};
export const buyFlowStep = (dataInput: string, amountBalance: string, allowanceBalance: string) => {
  if (new BigNumber(amountBalance).isEqualTo('0') || new BigNumber(dataInput).isGreaterThan(amountBalance)) {
    return STATUS_BALANCE.InsufficentBalance;
  }
  if (new BigNumber(dataInput).isGreaterThan(allowanceBalance)) {
    return STATUS_BALANCE.Approve;
  }
  return STATUS_BALANCE.SUBMIT;
};
