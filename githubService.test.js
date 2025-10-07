import axios from "axios";
import {
  buildReposUrl,
  buildRequestParams,
  shouldContinuePagination,
  mergeRepos,
  fetchReposPage,
  fetchRepos,
} from "./githubService.js";

jest.mock("axios");

describe("githubService", () => {
  describe("buildReposUrl", () => {
    test("should build correct GitHub API URL for a username", () => {
      const result = buildReposUrl("testuser");
      expect(result).toBe("https://api.github.com/users/testuser/repos");
    });
  });

  describe("buildRequestParams", () => {
    test("should build request params with default perPage", () => {
      const result = buildRequestParams(1);
      expect(result).toEqual({
        per_page: 100,
        page: 1,
        sort: "updated",
        direction: "desc",
      });
    });

    test("should build request params with custom perPage", () => {
      const result = buildRequestParams(2, 50);
      expect(result).toEqual({
        per_page: 50,
        page: 2,
        sort: "updated",
        direction: "desc",
      });
    });
  });

  describe("shouldContinuePagination", () => {
    test("should return true when response has full page", () => {
      const responseData = new Array(100).fill({ name: "repo" });
      const result = shouldContinuePagination(responseData, 100);
      expect(result).toBe(true);
    });

    test("should return false when response is partial page", () => {
      const responseData = new Array(50).fill({ name: "repo" });
      const result = shouldContinuePagination(responseData, 100);
      expect(result).toBe(false);
    });

    test("should return false when response is empty", () => {
      const responseData = [];
      const result = shouldContinuePagination(responseData, 100);
      expect(result).toBe(false);
    });
  });

  describe("mergeRepos", () => {
    test("should merge two arrays of repos", () => {
      const existing = [{ name: "Repo A" }, { name: "Repo B" }];
      const newRepos = [{ name: "Repo C" }, { name: "Repo D" }];

      const result = mergeRepos(existing, newRepos);

      expect(result).toEqual([
        { name: "Repo A" },
        { name: "Repo B" },
        { name: "Repo C" },
        { name: "Repo D" },
      ]);
    });

    test("should not mutate original arrays", () => {
      const existing = [{ name: "Repo A" }];
      const newRepos = [{ name: "Repo B" }];

      mergeRepos(existing, newRepos);

      expect(existing).toEqual([{ name: "Repo A" }]);
      expect(newRepos).toEqual([{ name: "Repo B" }]);
    });
  });

  describe("fetchReposPage", () => {
    test("should fetch a single page of repos", async () => {
      const mockRepos = [
        { name: "Repo A", stargazers_count: 10 },
        { name: "Repo B", stargazers_count: 5 },
      ];

      axios.get.mockResolvedValue({ data: mockRepos });

      const result = await fetchReposPage("testuser", 1);

      expect(axios.get).toHaveBeenCalledWith(
        "https://api.github.com/users/testuser/repos",
        {
          params: {
            per_page: 100,
            page: 1,
            sort: "updated",
            direction: "desc",
          },
        }
      );
      expect(result).toEqual(mockRepos);
    });
  });

  describe("fetchRepos", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      console.error.mockRestore();
    });

    test("should fetch all repos from single page", async () => {
      const mockRepos = [
        { name: "Repo A", stargazers_count: 10 },
        { name: "Repo B", stargazers_count: 5 },
      ];

      axios.get.mockResolvedValue({ data: mockRepos });

      const result = await fetchRepos("testuser");

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRepos);
    });

    test("should fetch all repos from multiple pages", async () => {
      const page1 = new Array(100).fill(null).map((_, i) => ({
        name: `Repo ${i}`,
        stargazers_count: i,
      }));
      const page2 = [
        { name: "Last Repo", stargazers_count: 50 },
      ];

      axios.get
        .mockResolvedValueOnce({ data: page1 })
        .mockResolvedValueOnce({ data: page2 });

      const result = await fetchRepos("testuser");

      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(result.length).toBe(101);
      expect(result[0].name).toBe("Repo 0");
      expect(result[100].name).toBe("Last Repo");
    });

    test("should stop when receiving empty response", async () => {
      axios.get.mockResolvedValue({ data: [] });

      const result = await fetchRepos("testuser");

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    test("should handle errors gracefully", async () => {
      axios.get.mockRejectedValue(new Error("API Error"));

      const result = await fetchRepos("testuser");

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching page 1 for user testuser:",
        "API Error"
      );
    });

    test("should stop pagination on error in subsequent pages", async () => {
      const page1 = [{ name: "Repo A", stargazers_count: 10 }];

      axios.get
        .mockResolvedValueOnce({ data: page1 })
        .mockRejectedValueOnce(new Error("Network Error"));

      const result = await fetchRepos("testuser");

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(page1);
    });
  });
});
