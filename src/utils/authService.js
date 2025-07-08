import { jwtDecode } from 'jwt-decode'; // ✅ Use named import

export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
