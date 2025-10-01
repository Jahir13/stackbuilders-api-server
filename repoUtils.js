export function filterReposByStars(repos) {
  return repos.filter((repo) => repo.stargazers_count > 5);
}

export function getLastUpdatedRepos(repos) {
  return [...repos]
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
    .slice(0, 5);
}

export function sumStars(repos) {
  return repos.reduce(
    (acc, currentItem) => acc + currentItem.stargazers_count,
    0,
  );
}
