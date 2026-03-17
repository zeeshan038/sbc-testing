import { baseApi } from "../../../app/baseApi";
import { home_url } from "../../../app/constant";

const homeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        initiateMultipart: builder.mutation({
            query: (body) => ({
                url: `${home_url}/initiate-multipart`,
                method: "POST",
                body,
            }),
        }),
        getPartUrl: builder.mutation({
            query: (body) => ({
                url: `${home_url}/get-part-url`,
                method: "POST",
                body,
            }),
        }),
        completeMultipart: builder.mutation({
            query: (body) => ({
                url: `${home_url}/complete-multipart`,
                method: "POST",
                body,
            }),
        }),
        finalizeTransfer: builder.mutation({
            query: ({ body, params }) => ({
                url: `${home_url}/send`,
                method: "POST",
                body,
                params,
            }),
            invalidatesTags: ["Transfer"],
        }),
        getTransfer: builder.query({
            query: ({ id, preview = true }) => ({
                url: `${home_url}/get-transfer/${id}`,
                params: { preview }
            }),
            providesTags: ["Transfer"],
        }),
        downloadTransfer: builder.mutation({
            query: ({ id }) => ({
                url: `${home_url}/download/${id}`,
                params: { preview: false }
            }),
            invalidatesTags: ["Transfer"],
        }),
    }),
});

export const {
    useInitiateMultipartMutation,
    useGetPartUrlMutation,
    useCompleteMultipartMutation,
    useFinalizeTransferMutation,
    useGetTransferQuery,
    useDownloadTransferMutation
} = homeApi;