import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import * as services from '../../services';

export const firestoreApi = createApi({
    baseQuery: fakeBaseQuery(),
    reducerPath: 'firestoreApi',
    tagTypes: ['Voucher'],
    endpoints: (builder) => ({
        addVoucher: builder.mutation({
            async queryFn(voucher) {
                try {
                    await services.addVoucher(voucher);
                    return { data: null };
                } catch (error) {
                    console.error(error?.message);
                    return { error: error?.message };
                }
            },
            invalidatesTags: ['Voucher']
        }),
        fetchVouchers: builder.query({
            async queryFn(filters) {
                try {
                    const data = await services.fetchVouchers(filters);
                    return { data };
                } catch (error) {
                    console.error(error?.message);
                    return { error: error?.message };
                }
            },
            providesTags: ['Voucher']
        }),
        deleteVoucher: builder.mutation({
            async queryFn(voucher) {
                try {
                    await services.deleteVoucher(voucher.code);
                    return { data: null }
                } catch (error) {
                    console.error(error?.message);
                    return { error: error?.message };
                }
            },
            invalidatesTags: ['Voucher']
        }),
        deleteVouchers: builder.mutation({
            async queryFn(date) {
                try {
                    await services.deleteVouchersByDate(date);
                    return { data: null }
                } catch (error) {
                    console.error(error?.message);
                    return { error: error?.message };
                }
            },
            invalidatesTags: ['Voucher']
        }),
        updateVoucher: builder.mutation({
            async queryFn(voucherCode, newAmount) {
                try {
                    await services.updateAmount(voucherCode, newAmount);
                    return { data: null }
                } catch (error) {
                    console.error(error?.message);
                    return { error: error?.message }
                }
            },
            invalidatesTags: ['Voucher']
        })
    })
})

export const {
    useAddVoucherMutation,
    useUpdateVoucherMutation,
    useDeleteVoucherMutation,
    useFetchVouchersQuery,
    useDeleteVouchersMutation,
} = firestoreApi

