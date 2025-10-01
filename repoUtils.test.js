import {
  filterReposByStars,
  getLastUpdatedRepos,
  sumStars,
} from "./repoUtils.js";

describe("filterReposByStars", () => {
  test("should only return repos with more than 5 stars", () => {
    const sampleRepos = [
      { name: "Repo A", stargazers_count: 10 },
      { name: "Repo B", stargazers_count: 3 },
      { name: "Repo C", stargazers_count: 8 },
    ];

    const result = filterReposByStars(sampleRepos);

    expect(result).toEqual([
      { name: "Repo A", stargazers_count: 10 },
      { name: "Repo C", stargazers_count: 8 },
    ]);
  });

  test("should return the last 5 updated repos in order", () => {
    const sampleRepos = [
      { name: "Oldest", pushed_at: "2025-01-01T00:00:00Z" },
      { name: "Newest", pushed_at: "2025-10-01T00:00:00Z" },
      { name: "Third Newest", pushed_at: "2025-08-01T00:00:00Z" },
      { name: "Fourth Newest", pushed_at: "2025-07-01T00:00:00Z" },
      { name: "Second Newest", pushed_at: "2025-09-01T00:00:00Z" },
      { name: "Fifth Newest", pushed_at: "2025-06-01T00:00:00Z" },
    ];

    const result = getLastUpdatedRepos(sampleRepos);

    expect(result.length).toBe(5);
    expect(result[0].name).toBe("Newest");
    expect(result[4].name).toBe("Fifth Newest");
  });

  test("should return the sum of all repository stars", () => {
    const sampleRepos = [
      { name: "Repo A", stargazers_count: 10 },
      { name: "Repo B", stargazers_count: 25 },
      { name: "Repo C", stargazers_count: 5 },
    ];

    const result = sumStars(sampleRepos);

    expect(result).toBe(40);
  });
});
