import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  getIndexNowKey,
  indexNowKeyFileName,
  indexNowKeyLocation,
  submitIndexNowUrls,
} from "@/lib/indexnow";

describe("getIndexNowKey", () => {
  const prev = process.env.INDEXNOW_KEY;

  afterEach(() => {
    if (prev === undefined) delete process.env.INDEXNOW_KEY;
    else process.env.INDEXNOW_KEY = prev;
  });

  it("accepts a valid hex key", () => {
    process.env.INDEXNOW_KEY = "a1b2c3d4e5f67890";
    expect(getIndexNowKey()).toBe("a1b2c3d4e5f67890");
    expect(indexNowKeyFileName()).toBe("a1b2c3d4e5f67890.txt");
    expect(indexNowKeyLocation()).toContain("/indexnow/a1b2c3d4e5f67890.txt");
  });

  it("rejects short or invalid keys", () => {
    process.env.INDEXNOW_KEY = "short";
    expect(getIndexNowKey()).toBeUndefined();
    process.env.INDEXNOW_KEY = "bad key!";
    expect(getIndexNowKey()).toBeUndefined();
  });
});

describe("submitIndexNowUrls", () => {
  const prevKey = process.env.INDEXNOW_KEY;

  beforeEach(() => {
    process.env.INDEXNOW_KEY = "a1b2c3d4e5f67890";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200 }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (prevKey === undefined) delete process.env.INDEXNOW_KEY;
    else process.env.INDEXNOW_KEY = prevKey;
  });

  it("POSTs host, key, keyLocation, and urlList", async () => {
    const result = await submitIndexNowUrls([
      "https://performance.zervtek.com/stock",
    ]);
    expect(result.ok).toBe(true);
    expect(result.submitted).toBe(1);

    const fetchMock = vi.mocked(fetch);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    const payload = JSON.parse(String(init?.body));
    expect(payload.host).toBe("performance.zervtek.com");
    expect(payload.key).toBe("a1b2c3d4e5f67890");
    expect(payload.keyLocation).toContain("/indexnow/a1b2c3d4e5f67890.txt");
    expect(payload.urlList).toEqual(["https://performance.zervtek.com/stock"]);
  });
});
