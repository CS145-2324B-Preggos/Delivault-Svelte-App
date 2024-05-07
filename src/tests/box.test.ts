import { describe, it, expect, beforeEach, after } from "vitest";
import { type BoxDBObj, type BoxFilter, type BoxResponse } from "$lib/classes/Box";
import { insertBoxDB, deleteBoxDB, updateBoxDB, selectBoxDB } from "$lib/server/BoxSB";

describe('sanity/integrity test: it should add properly', () => {
    it('adds 5 + 4 to equal 9', () => {
      expect(5 + 4).toBe(9);
    });
  });