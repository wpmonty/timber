/**
 * Helper function to handle API responses consistently
 * Extracts error details from our standardized API error format
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      // Use our standardized error format: { error: string }
      const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    } catch (parseError) {
      // Fallback if response isn't JSON
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  return response.json();
}

/**
 * Helper for API calls that should extract data from wrapped responses
 * Some endpoints return { data: T } while others return T directly
 */
export async function handleApiResponseWithData<T>(response: Response): Promise<T> {
  const result = await handleApiResponse<{ data?: T } | T>(response);

  // If response is wrapped in { data: ... }, extract it
  if (result && typeof result === 'object' && 'data' in result) {
    return result.data as T;
  }

  // Otherwise return as-is
  return result as T;
}
