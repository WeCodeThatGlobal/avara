export const getBaseURL = () => {
  return process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
}
