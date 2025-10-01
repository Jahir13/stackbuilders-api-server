import request from "supertest";
import { app } from "./app.js";
import { fetchRepos } from "./githubService.js";

jest.mock("./githubService.js");

describe("GET /api/repos/:username", () => {
  test("should return processed repo data", async () => {
    // Arrange: Use more realistic fake data
    const fakeRepos = [
      {
        name: "Repo A",
        stargazers_count: 10,
        pushed_at: "2025-01-01T00:00:00Z",
      },
      {
        name: "Repo B",
        stargazers_count: 3,
        pushed_at: "2025-02-01T00:00:00Z",
      },
    ];
    fetchRepos.mockResolvedValue(fakeRepos);

    // Act
    const response = await request(app).get("/api/repos/google");

    // Assert: Check the new response structure
    expect(response.statusCode).toBe(200);
    expect(response.body.totalStars).toBe(13);
    expect(response.body.reposWithMoreThan5Stars).toEqual([
      {
        name: "Repo A",
        stargazers_count: 10,
        pushed_at: "2025-01-01T00:00:00Z",
      },
    ]);
  });
});
