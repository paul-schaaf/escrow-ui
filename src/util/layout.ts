import * as BufferLayout from "buffer-layout";

/**
 * Layout for a public key
 */
export const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

/**
 * Layout for a 64bit unsigned value
 */
export const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};
