import { useEffect, useMemo } from 'react';
import useSWR from 'swr';

import { getSiteUrl } from '../helper';

interface FetcherError extends Error {
  info?: string;
  status?: number;
}

export interface ThrottleError extends Error {
  status?: number;
  isThrottled: boolean;
}

export class ThrottleError extends Error {
  constructor(message: string) {
    super(message);
    this.isThrottled = true;
  }
}

export const fetcher = async (url: RequestInfo, params?: RequestInit) => {
  const res = await fetch(url, params);
  const resParsed = await res.json();

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.'
    ) as FetcherError;
    // Attach extra info to the error object.
    error.info = resParsed;
    error.status = res.status;
    throw error;
  }

  if (resParsed?.detail?.includes('Request was throttled')) {
    const error = new ThrottleError(
      'Throttled by OpenSea. Please try again later.'
    );
    throw error;
  }

  return resParsed;
};

// TODO the fetches are a bit too heavy returning all the data for each token / collection.
// Need to refactor to graphql for better performance.

export default function useFetcher<T>(url: string) {
  const { data, error } = useSWR<T>(`${getSiteUrl()}${url}`, {
    fetcher,
  });

  // For debugging purposes, and future logging (sentry etc.)
  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  let localError = error;
  const loading = useMemo(() => {
    if (!data && !error) return true;

    if (error?.isThrottled) {
      localError = null;
      return true;
    }

    return false;
  }, [data, error]);

  return { loading, data, error: localError };
}
