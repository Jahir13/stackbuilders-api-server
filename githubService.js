import axios from "axios";

export async function fetchRepos(username) {
  const response = await axios.get(
    `https://api.github.com/users/${username}/repos`,
  );
  return response.data;
}
