import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import RemoteImage from './RemoteImage';

const defaultImageUri = "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const ProductItem = ({ product }) => {
  return (
    <Link href={`/products/${product.id}`} asChild>
      <Pressable style={styles.pressable}>
        <View style={styles.container}>
          <RemoteImage
            path={product.image}
            fallback={defaultImageUri}
            style={styles.image}
            dataLink='product-images'
            resizeMode="contain"
          />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{product.apartments.name}</Text>
            <View style={styles.row}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{product.dong} Dong {product.ho} Ho</Text>
              </View>
            </View>
            {product.trade_type === 'Sale' ? (
              <View style={styles.row}>
                <View style={[styles.tradeTag, styles.saleTag]}>
                  <Text style={styles.saleText}>Sale</Text>
                </View>
                <Text style={styles.saleText}> { product.sale_price}₩</Text>
              </View>
            ) : product.trade_type === 'Jeonse' ? (
              <View style={styles.row}>
                <View style={[styles.tradeTag, styles.jeonseTag]}>
                  <Text style={styles.jeonseText}>Jeonse</Text>
                </View>
                <Text style={styles.jeonseText}> { product.jeonse_price}₩</Text>
              </View>
            ) : product.trade_type === 'Rent' ? (
              <View style={styles.row}>
                <View style={[styles.tradeTag, styles.rentTag]}>
                  <Text style={styles.rentText}>Rent</Text>
                </View>
                <Text style={styles.rentText}> {product.rent_deposit}/{product.rent_price}₩</Text>
              </View>
            ) : null}
          <View style={styles.rowLeft}>
            {product.status === 'Active' ? (
              <View style={[styles.statusTag, styles.activeTag]}>
                <Text style={styles.activeText}>Active</Text>
              </View>
            ) : product.status === 'Sold' ? (
              <View style={[styles.statusTag, styles.soldTag]}>
                <Text style={styles.soldText}>Sold</Text>
              </View>
            ) : product.status === 'Process' ? (
              <View style={[styles.statusTag, styles.processTag]}>
                <Text style={styles.processText}>Process</Text>
              </View>
            ) : null}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: '#F3F4F6', // Equivalent to bg-gray-100
    padding: 8,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB', // Equivalent to border-gray-300
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: '40%',
    justifyContent:'center',
    alignItems: 'flex-end',
    aspectRatio: 4 / 3, // Equivalent to aspect-[4/3]
  },
  infoContainer: {
    marginLeft: 8,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row', // Equivalent to 'flex-row'
    alignItems: 'flex-start', // Equivalent to 'items-start'
  },
  tag: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: '#E5E7EB', // bg-gray-200
    borderRadius: 4,
    borderColor: '#9CA3AF', // border-gray-400
    borderWidth: 1,
    marginBottom: 3,
  },
  tagText: {
    color: '#6B7280', // text-gray-500
  },
  tradeTag: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  saleTag: {
    backgroundColor: '#FECACA', // bg-red-200
    borderColor: '#F87171', // border-red-400
  },
  saleText: {
    color: '#EF4444', // text-red-500
    fontWeight: 'bold',
  },
  jeonseTag: {
    backgroundColor: '#BFDBFE', // bg-blue-200
    borderColor: '#60A5FA', // border-blue-400
  },
  jeonseText: {
    color: '#3B82F6', // text-blue-500
    fontWeight: 'bold',
  },
  rentTag: {
    backgroundColor: '#E5E7EB', // bg-gray-200
    borderColor: '#9CA3AF', // border-gray-400
  },
  rentText: {
    color: '#6B7280', // text-gray-500
    fontWeight: 'bold',
  },
  statusTag: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 3,
  },
  activeTag: {
    backgroundColor: '#FECACA', // bg-red-200
    borderColor: '#F87171', // border-red-400
  },
  activeText: {
    color: '#EF4444', // text-red-500
  },
  soldTag: {
    backgroundColor: '#E5E7EB', // bg-gray-200
    borderColor: '#9CA3AF', // border-gray-400
  },
  soldText: {
    color: '#6B7280', // text-gray-500
  },
  processTag: {
    backgroundColor: '#BFDBFE', // bg-blue-200
    borderColor: '#60A5FA', // border-blue-400
  },
  processText: {
    color: '#3B82F6', // text-blue-500
  },
});

export default ProductItem;
