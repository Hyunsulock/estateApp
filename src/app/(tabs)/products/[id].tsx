import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, Alert, ScrollView, Linking, StyleSheet } from "react-native";
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useDeleteProduct, useProduct, useUpdateProduct } from "@/api/products";
import { useAuth } from "@/providers/AuthProvider";
import { useUpdateProductSubscription } from "@/api/products/subscriptions";
import RemoteImage from "@/components/RemoteImage";

const ProductDetailsScreen = () => {
    const { mutate: deleteProduct } = useDeleteProduct();
    const { id: idString } = useLocalSearchParams();
    const { session, loading, profile, setProfile } = useAuth();

    const productId = parseFloat(typeof idString === 'string' ? idString : idString[0]);
    const { data: product, error, isLoading } = useProduct(profile.workspace, productId);
    const { mutate: updateProduct } = useUpdateProduct();
    useUpdateProductSubscription(profile.workspace, productId);
    const statusTypes: string[] = ['Active', 'Sold', 'Process'];

    const updateStatus = async (status: string) => {
        updateProduct({ ...product, status: status });
    };

    const defaultImageUri = "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const onDelete = () => {
        deleteProduct(productId, {
            onSuccess: () => {
                router.navigate('/(tabs)/products');
            },
        });
    };

    const confirmDelete = () => {
        Alert.alert('Confirm', 'Are you sure you want to delete?', [
            { text: 'Cancel' },
            { text: 'Delete', style: 'destructive', onPress: onDelete }
        ]);
    };

    if (!product) {
        return <View><Text>Invalid ID</Text></View>;
    }

    return (
        <View>
            <Stack.Screen options={{ title: 'Details ' + product.id, headerRight: () => (
                <>
                    <Pressable onPress={confirmDelete} style={styles.iconButton}>
                        <FontAwesome name="trash" size={25} color="black" />
                    </Pressable>
                    <Link href={`/(tabs)/products/create?id=${product.id}`} asChild>
                        <Pressable style={styles.iconButton2}>
                            <FontAwesome name="pencil" size={25} color="black" />
                        </Pressable>
                    </Link>
                </>
            ) }} />

            <ScrollView>
                <RemoteImage
                    path={product.image}
                    fallback={defaultImageUri}
                    style={styles.image}
                    dataLink="product-images"
                    resizeMode="auto"
                />

                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{product.apartments.name}</Text>
                        <Text style={styles.subTitle}>{product.dong} dong {product.ho} ho</Text>
                    </View>

                    {product.trade_type === 'Sale' && (
                        <Text style={[styles.tradeText, styles.saleText]}>Sale {product.sale_price}₩</Text>
                    )}
                    {product.trade_type === 'Jeonse' && (
                        <Text style={[styles.tradeText, styles.saleText]}>Jeonse {product.jeonse_price}₩</Text>
                    )}
                    {product.trade_type === 'Rent' && (
                        <Text style={[styles.tradeText, styles.saleText]}>Rent {product.rent_deposit}/{product.rent_price}₩</Text>
                    )}

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>APARTMENT</Text>
                        <Text style={styles.infoDivider}> | </Text>
                        <Text style={styles.infoText}> {product.size}M²</Text>
                        <Text style={styles.infoDivider}> | </Text>
                        <Text style={styles.infoText}>{product.floor}F</Text>
                        <Text style={styles.infoDivider}> | </Text>
                        <Text style={styles.infoText}> {product.house_type} TYPE</Text>
                    </View>

                    <Text style={styles.addressText}>{product.apartments.address}</Text>
                    <Text style={styles.featuresText}>Features: {product.features}</Text>

                    <Text style={styles.sectionTitle}>Status</Text>
                    <View style={styles.statusContainer}>
                        {statusTypes.map((status) => (
                            <Pressable
                                key={status}
                                onPress={() => updateStatus(status)}
                                style={[
                                    styles.statusButton,
                                    product.status === status ? styles.selectedButton : styles.unselectedButton
                                ]}
                            >
                                <Text
                                    style={[
                                        product.status === status ? styles.selectedText : styles.unselectedText
                                    ]}
                                >
                                    {status}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Owner Details</Text>
                    <Pressable onPress={() => Linking.openURL(`tel:${product.phone}`)} style={styles.ownerButton}>
                        <Text style={styles.ownerText}>{product.owner} :</Text>
                        <Text style={styles.ownerText}>{product.phone}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    iconButton: {
        marginRight: 17,
        opacity: 1,
    },
    iconButton2: {
        marginRight: 7,
        marginLeft:6,
        opacity: 1,
    },
    image: {
        width: '100%',
        aspectRatio: 4 / 3,
    },
    content: {
        marginHorizontal: 10,
    },
    titleContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        
        alignItems:'baseline',
        marginTop: 15,
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        marginRight:10
    },
    subTitle: {
        fontSize: 17,
        fontWeight:'600',
        marginBottom: 2,
    },
    tradeText: {
        fontSize: 19,
        fontWeight: 'bold',
    },
    saleText: {
        color: 'red',
    },
    infoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop:5,
        marginBottom: 5,
    },
    infoText: {
        fontSize: 16,
        color: '#64748B',
    },
    infoDivider: {
        fontSize: 14,
        color: '#64748B',
    },
    addressText: {
        fontSize: 18,
        marginBottom: 10,
    },
    featuresText: {
        fontSize: 18,
        marginBottom: 10,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
    },
    statusContainer: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 10,
    },
    statusButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 25,
        borderWidth: 2,
        marginRight: 10,
    },
    selectedButton: {
        backgroundColor: '#BFDBFE',
        borderColor: '#4299e1',
    },
    unselectedButton: {
        backgroundColor: 'transparent',
        borderColor: '#D1D5DB',
    },
    selectedText: {
        color: '#4299e1',
    },
    unselectedText: {
        color: '#64748B',
    },
    ownerButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#64748B',
        marginVertical: 10,
    },
    ownerText: {
        fontSize: 18,
        color: '#64748B',
        fontWeight: 'bold',
    },
});

export default ProductDetailsScreen;
