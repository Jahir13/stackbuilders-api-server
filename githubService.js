import axios from "axios";

export function buildReposUrl(username) {
  return `https://api.github.com/users/${username}/repos`;
}

export function buildRequestParams(page, perPage = 100) {
  return {
    per_page: perPage,
    page: page,
    sort: "updated",
    direction: "desc",
  };
}

export function shouldContinuePagination(responseData, perPage) {
  return responseData.length > 0 && responseData.length === perPage;
}

export function mergeRepos(existingRepos, newRepos) {
  return [...existingRepos, ...newRepos];
}

export async function fetchReposPage(username, page, perPage = 100) {
  const url = buildReposUrl(username);
  const params = buildRequestParams(page, perPage);

  const response = await axios.get(url, { params });
  return response.data;
}

export async function fetchRepos(username) {
  let allRepos = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    try {
      const pageData = await fetchReposPage(username, page, perPage);

      if (pageData.length === 0) {
        break;
      }

      allRepos = mergeRepos(allRepos, pageData);

      if (!shouldContinuePagination(pageData, perPage)) {
        break;
      }

      page++;
    } catch (error) {
      console.error(
        `Error fetching page ${page} for user ${username}:`,
        error.message
      );
      break;
    }
  }

  return allRepos;
}