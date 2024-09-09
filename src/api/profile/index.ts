import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProfile = (id: number) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

        console.log(data)

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};


export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data_: any) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: data_.username,
          full_name: data_.full_name,
          avatar_url: data_.avatar_url,
          workspace: data_.workspace,
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
      await queryClient.invalidateQueries(['profile', data.id]);
    },
  });
};