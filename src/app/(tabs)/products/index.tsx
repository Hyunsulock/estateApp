import { Link, Redirect, router, Stack } from 'expo-router';
import { StyleSheet, Text, View, Pressable, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import React from 'react';
import ProductItem from "@/components/productListItem";
import { useProductList } from '@/api/products';
import { useAuth } from '@/providers/AuthProvider';
import Octicons from '@expo/vector-icons/Octicons';

export default function Products() {
  const { session, loading, profile } = useAuth();

  const onPressFilter = () => {
    router.push('/(tabs)/products/filter');
  };

  if (!profile.workspace) {
    return <Redirect href={"/(workspace)/workspaces"} />;
  }

  const { data: products, error, isLoading } = useProductList(profile.workspace);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <ImageBackground source={require('../../../../assets/waiting.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Products',
            headerRight: () => (
              <>
                <Link href={'/(tabs)/products/create'} asChild>
                  <Pressable style={styles.headerIcon}>
                    {({ pressed }) => (
                      <Octicons 
                        name="diff-added" 
                        size={24} 
                        color="black" 
                        style={{ opacity: pressed ? 0.5 : 1 }} 
                      />
                    )}
                  </Pressable>
                </Link>
              </>
            )
          }} 
        />
        <Pressable 
          onPress={onPressFilter} 
          style={styles.filterButton}>
          <Text style={styles.filterText}>Filters</Text>
        </Pressable>

        <FlatList
          data={products}
          renderItem={({ item }) => <ProductItem product={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 16, // pt-4 equivalent
    paddingHorizontal: 16, // px-4 equivalent
  },
  headerIcon: {
    marginRight: 4, // mr-1 equivalent
  },
  filterButton: {
    backgroundColor: '#4299e1', // bg-blue-400 equivalent
    padding: 16, // p-4 equivalent
    borderRadius: 20, // rounded-2xl equivalent
    marginVertical: 8, // my-2 equivalent
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // shadow-2xl equivalent
  },
  filterText: {
    color: 'white',
    fontSize: 18, // text-lg equivalent
    fontWeight: '600', // font-semibold equivalent
  },
});


