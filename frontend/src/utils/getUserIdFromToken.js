// Function to decode JWT token and extract user ID
export const getUserIdFromToken = (token, data = "id") => {
  try {
    // JWT tokens are split into three parts by dots
    const payload = token.split(".")[1];
    // The middle part is the payload, which we need to decode
    const decodedPayload = JSON.parse(atob(payload));
    if (!data) return "Masukan Data";

    if (data == "id") return decodedPayload.id;

    if (data == "role") return decodedPayload.role;

    if (data == "email") return decodedPayload.email;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
