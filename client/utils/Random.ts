import {times} from "lodash";

const possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const randomChar = (): string => possible.charAt(Math.floor(Math.random() * possible.length));

export const make = (length): string => times(length, randomChar).join('');
