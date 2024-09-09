import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useProductList = (workspaceId: string) => {

  const [filters, setFilters] = useState<{
    sizeValue?: number[];
    salePriceValue?: number[];
    jeonsePriceValue?: number[];
    rentPriceValue?: number[];
    rentDepositPriceValue?: number[];
    tradeType?: string;
    selectedStatus?: string[];
    selectedApartments?: any[]; // Store selected apartments
  }>({});
  const loadFilters = async () => {
    try {
      const [
        savedSizeValue,
        savedSalePriceValue,
        savedJeonsePriceValue,
        savedRentPriceValue,
        savedRentDepositPriceValue,
        savedTradeType,
        savedSelectedStatus,
        savedSelectedApartments, // New addition to load apartments
      ] = await Promise.all([
        AsyncStorage.getItem('sizeValue'),
        AsyncStorage.getItem('salePriceValue'),
        AsyncStorage.getItem('jeonsePriceValue'),
        AsyncStorage.getItem('rentPriceValue'),
        AsyncStorage.getItem('rentDepositPriceValue'),
        AsyncStorage.getItem('tradeType'),
        AsyncStorage.getItem('selectedStatus'),
        AsyncStorage.getItem('selectedApartments'), // Retrieve selected apartments
      ]);

      setFilters({
        sizeValue: savedSizeValue ? JSON.parse(savedSizeValue) : undefined,
        salePriceValue: savedSalePriceValue ? JSON.parse(savedSalePriceValue) : undefined,
        jeonsePriceValue: savedJeonsePriceValue ? JSON.parse(savedJeonsePriceValue) : undefined,
        rentPriceValue: savedRentPriceValue ? JSON.parse(savedRentPriceValue) : undefined,
        rentDepositPriceValue: savedRentDepositPriceValue ? JSON.parse(savedRentDepositPriceValue) : undefined,
        tradeType: savedTradeType ? JSON.parse(savedTradeType) : undefined,
        selectedStatus: savedSelectedStatus ? JSON.parse(savedSelectedStatus) : undefined,
        selectedApartments: savedSelectedApartments ? JSON.parse(savedSelectedApartments) : undefined, // Load apartments
      });
    } catch (err) {
      console.error('Error loading filters:', err);
    } 

  };

  loadFilters();


  return useQuery({
    queryKey: ['products', workspaceId],
    queryFn: async () => {
      console.log('squeru', ...[filters.selectedApartments?.map((value)=>(value.id))])
      //const {data: dataRow, error: error2} = await supabase.from('products').select('*, apartments (*)').eq('workspace', workspaceId)


      let query =  supabase.from('products').select('*, apartments (*)').eq('workspace', workspaceId)

      if (filters.selectedApartments) {
        console.log('hi')
        query = query.in('apartment',...[filters.selectedApartments!.map((value)=>(value.id))])
      }
      if (filters.tradeType) {
        if (filters.tradeType[0] == 'Sale') {
          query = query.eq('trade_type', filters.tradeType[0]).gte('sale_price', filters.salePriceValue![0]).lte('sale_price', filters.salePriceValue![1])
        } else if (filters.tradeType[0] == 'Rent') {
          query = query.eq('trade_type', filters.tradeType[0])
          .gte('rent_price', filters.rentPriceValue![0])
          .lte('rent_price', filters.rentPriceValue![1])
          .gte('rent_deposit', filters.rentDepositPriceValue![0])
          .lte('rent_deposit', filters.rentDepositPriceValue![1])
        } else if ( filters.tradeType[0]== 'Jeonse') {
          query = query.eq('trade_type', filters.tradeType)
          .gte('jeonse_price', filters.jeonsePriceValue![0])
          .lte('jeonse_price', filters.jeonsePriceValue![1])
        }

      }

      if (filters.selectedStatus) {
        query = query.in('status', ...[filters.selectedStatus!.map((value)=>(value))])
      }

      if (filters.sizeValue) {
        query = query
          .gte('size', filters.sizeValue![0])
          .lte('size', filters.sizeValue![1])
      }


      const {data, error} = await query.order('created_at', { ascending: false })



      if (error) {
        throw new Error(error.message);
      }
      console.log("data", data)

      return data;
    },
  });
};


export const useProduct = (workspaceId: string, productId: number) => {
  return useQuery({
    queryKey: ['products', workspaceId, productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, apartments (*)')
        .eq('id', productId).eq('workspace', workspaceId)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};


export const useInsertProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data_: any) {
      console.log('hi', data_.image)
      let { data, error } = await supabase
        .from('products')
        .insert({
          apartment: data_.apartment,
          dong: data_.dong,
          ho: data_.ho,
          features: data_.features,
          floor : data_.floor,
          house_type : data_.house_type,
          jeonse_price : data_.jeonse_price,
          rent_deposit : data_.rent_deposit,
          rent_price : data_.rent_price,
          sale_price : data_.sale_price,
          size : data_.size,
          status : data_.status,
          trade_type : data_.trade_type,
          workspace : data_.workspace,
          image: data_.image,
          owner: data_.owner,
          phone: data_.phone,
        }).select();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries(['products', data[0].workspace]);
    },
  });
};



export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data_: any) {
      const { data, error } = await supabase
        .from('products')
        .update({
          apartment: data_.apartment,
          dong: data_.dong,
          ho: data_.ho,
          features: data_.features,
          floor : data_.floor,
          house_type : data_.house_type,
          jeonse_price : data_.jeonse_price,
          rent_deposit : data_.rent_deposit,
          rent_price : data_.rent_price,
          sale_price : data_.sale_price,
          size : data_.size,
          status : data_.status,
          trade_type : data_.trade_type,
          workspace : data_.workspace,
          image: data_.image,
          owner: data_.owner,
          phone: data_.phone,
        })
        .eq('id', data_.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries(['products', data.workspace]);
      await queryClient.invalidateQueries(['products', data.workspace, data.id]);
    },
  });
};


export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      console.log('hi')
      const { data, error } = await supabase.from('products').delete().eq('id', id).select().single();
      if (error) {
        throw new Error(error.message);
      }

      console.log(data)
      return data
    },
    async onSuccess(data) {
      await queryClient.invalidateQueries(['products', data.workspace]);
    },
  });
};