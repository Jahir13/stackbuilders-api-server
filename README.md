# GitHub Repository API Server

This is a simple Node.js API server built with Express that fetches and processes public repository data from the GitHub API.

## Features

-   Fetches all public repositories for a given GitHub username.
-   Calculates the total number of stars across all repositories.
-   Provides a list of the last 5 updated repositories.
-   Provides a filtered list of repositories with more than 5 stars.

## Project Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Jahir13/stackbuilders-api-server
    cd github-api-server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the server:**
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:3000`.

## API Endpoint

### Get Processed Repository Data

-   **URL**: `/api/repos/:username`
-   **Method**: `GET`
-   **Description**: Retrieves and processes repository data for the specified GitHub user.
-   **Example Request**:
    ```bash
    curl http://localhost:3000/api/repos/stackbuilders
    ```
-   **Example Success Response**:
    ```json
    {
      "totalStars": 13,
      "last5Updated": [
        {
          "name": "Repo B",
          "pushed_at": "2025-02-01T00:00:00Z"
        },
        {
          "name": "Repo A",
          "pushed_at": "2025-01-01T00:00:00Z"
        }
      ],
      "reposWithMoreThan5Stars": [
        {
          "name": "Repo A",
          "stargazers_count": 10
        }
      ]
    }
    ```

## Testing

This project uses Jest for unit and integration testing and Supertest for API endpoint testing.

1.  **Run all tests:**
    ```bash
    npm test
    ```

2.  **Run tests with coverage report:**
    The test command is already configured to generate a coverage report. After running the tests, an interactive HTML report will be available in the `coverage/lcov-report/` directory.