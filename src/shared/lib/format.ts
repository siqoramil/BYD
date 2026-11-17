export const formatUsd = (value: number) =>
  '$' + Math.round(value).toLocaleString('en-US').replace(/,/g, ' ')

export const formatNumber = (value: number) =>
  Math.round(value).toLocaleString('en-US').replace(/,/g, ' ')
