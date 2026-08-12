import { Types } from "mongoose";
import type z from "zod";

export const parseOrThrow = <T>(schema: z.Schema<T>, payload: unknown): T => {
  return schema.parse(payload);
};

/**
 *
 * @param {number} value Number
 * @returns {number} Rounded to 2 decimal places
 */
export const double = (value: number) => {
  return parseFloat(value.toFixed(2));
};

export const validateObjectId = (
  id: Parameters<typeof Types.ObjectId.isValid>[0],
) => {
  return Types.ObjectId.isValid(id);
};

export const transformToObjectId = (id: string) => {
  if (!validateObjectId(id)) {
    throw new Error("Please provide a valid MongoDB ID!");
  }

  return new Types.ObjectId(id);
};

export const toObjectIdString = (value: unknown): string | null => {
  if (!value) return null;
  if (typeof value === "string") return value; // already fine
  const buf = (value as any).buffer;
  if (!buf) return null;
  return new Types.ObjectId(
    Buffer.from(Object.values(buf) as number[]),
  ).toHexString();
};
