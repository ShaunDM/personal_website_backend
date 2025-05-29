//a series of variables useful for augmenting timestamps

export const minInMs = 6000;
export const hrInMs = minInMs * 60;
export const dayInMs = hrInMs * 24;
export const wkInMs = dayInMs * 7;
export const yrsInMs = (yrs) => Math.floor(dayInMs * 365.25 * yrs);
