import { baseApi } from "../../../app/baseApi";
import { download_url } from "../../../app/constant";

const downloadApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDownloadDetails: builder.query({
            query: (id) => ({
                url: `${download_url}/download/${id}`,
                method: 'GET',
            }),
        }),
        startDownloadSession: builder.mutation({
            query: ({ id, downloadSessionId }) => ({
                url: `${download_url}/download-start/${id}`,
                method: 'POST',
                body: { downloadSessionId },
            }),
        }),
        completeDownloadSession: builder.mutation({
            query: ({ id, downloadSessionId }) => ({
                url: `${download_url}/download-complete/${id}`,
                method: 'POST',
                body: { downloadSessionId },
            }),
        }),
        cancelDownloadSession: builder.mutation({
            query: ({ id, downloadSessionId }) => ({
                url: `${download_url}/download-cancel/${id}`,
                method: 'POST',
                body: { downloadSessionId },
            }),
        }),
    }),
});

export const {
    useGetDownloadDetailsQuery,
    useLazyGetDownloadDetailsQuery,
    useStartDownloadSessionMutation,
    useCompleteDownloadSessionMutation,
    useCancelDownloadSessionMutation,
} = downloadApi;