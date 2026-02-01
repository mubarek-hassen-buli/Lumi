import { createFetch } from "@better-fetch/fetch";

export const api = createFetch({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include", // Ensure cookies are sent
    onResponse: async ({ response }) => {
        if (response.status === 401) {
            // Handle unauthorized - maybe redirect to login or clear session
        }
    },
})
