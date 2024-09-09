import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';





export const useInsertProductSubscription = (workspaceId: string) => {
    const queryClient = useQueryClient();

    useEffect(() => {
    const productsSubscription = supabase
        .channel('custom-insert-channel')
        .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'products' },
        (payload) => {
            console.log('Change received!', payload);
            queryClient.invalidateQueries(['products', workspaceId]);
        }
        )
        .subscribe();

    return () => {
        productsSubscription.unsubscribe();
    };
    }, []);
};

export const useUpdateProductSubscription = ( workspaceId: string, id: number) => {
    const queryClient = useQueryClient();

    useEffect(() => {
    const productsUpdateSubscription = supabase
        .channel('custom-filter-channel')
        .on(
        'postgres_changes',
        {
            event: 'UPDATE',
            schema: 'public',
            table: 'products',
            filter: `id=eq.${id}`,
        },
        (payload) => {
            queryClient.invalidateQueries(['products', workspaceId, id]);
        }
        )
        .subscribe();

    return () => {
        productsUpdateSubscription.unsubscribe();
    };
    }, []);
};
