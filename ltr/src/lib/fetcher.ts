/**
 * Fetcher function for SWR
 * Handles API requests and error handling
 */
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("Failed to fetch data");
    throw error;
  }

  return res.json();
};

/**
 * Fetcher with authentication token
 */
export const authFetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include", // Include cookies for JWT
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
