// Function to decode JWT token and extract user ID
export const getUserIdFromToken = (token) => {
  try {
    // JWT tokens are split into three parts by dots
    const payload = token.split(".")[1];
    // The middle part is the payload, which we need to decode
    const decodedPayload = JSON.parse(atob(payload));
    // Extract the user ID from the payload
    return decodedPayload.id || decodedPayload.role || decodedPayload.email;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
