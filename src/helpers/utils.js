export const parseJSONResponse = async (response, defaultValue) => {
  try {
    const responseJSON = await response.json();
    return responseJSON;
  } catch {
    return defaultValue;
  }
};
