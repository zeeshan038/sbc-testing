import { baseApi } from "../../../app/baseApi";
import { auth_url } from "../../../app/constant";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (body) => ({
                url: `${auth_url}/register`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),
        login: builder.mutation({
            query: (body) => ({
                url: `${auth_url}/login`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),
        signInWithGoogle: builder.mutation({
            query: (body) => ({
                url: `${auth_url}/signupwithgoogle`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),
        signUpWithMicrosoft: builder.mutation({
            query: (body) => ({
                url: `${auth_url}/signupwithmicrosoft`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useSignInWithGoogleMutation,
    useSignUpWithMicrosoftMutation,
} = authApi;