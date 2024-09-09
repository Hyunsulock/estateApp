import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useWorkspaceList = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data, error } = await supabase.from('workspaces').select('*, owner_profile: profiles!owner (id, username, full_name, avatar_url)');
      if (error) {
        throw new Error(error.message);
      }
      console.log(data)
      return data;
    },
  });
};

export const useWorkspace = (id: number) => {
  return useQuery({
    queryKey: ['workspaces', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*, owner_profile: profiles!owner (*)')
        .eq('id', id)
        .single();

      console.log('da--',data)

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};


export const useInsertWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data_: any) {
      let { data, error } = await supabase
        .from('workspaces')
        .insert({
          name: data_.name,
          description: data_.description,
          owner: data_.owner,
        }).select();
      if (error) {
        throw new Error(error.message);
      }

      return data;
    },

    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries(['workspaces']);
    },
  });
};