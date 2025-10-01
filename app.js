import express from "express";
import { fetchRepos } from "./githubService.js";
import {
  filterReposByStars,
  getLastUpdatedRepos,
  sumStars,
} from "./repoUtils.js";

export const app = express();

app.get("/api/repos/:username", async (req, res) => {
  const { username } = req.params;
  const allRepos = await fetchRepos(username);

  const reposWithMoreThan5Stars = filterReposByStars(allRepos);
  const last5Updated = getLastUpdatedRepos(allRepos);
  const totalStars = sumStars(allRepos);

  res.json({
    totalStars,
    last5Updated,
    reposWithMoreThan5Stars,
  });
});
