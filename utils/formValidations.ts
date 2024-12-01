export const checkForValidPassword = (value: string) =>
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/.test(value);

export const checkIfSpecialCharacters = (value: string) =>
  /^[a-zA-Z\s]*$/.test(value);
