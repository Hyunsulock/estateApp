import Button from '@/components/button';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react';
import { Text, TextInput, View, Image, Pressable, Alert} from 'react-native'
import { StyleSheet, ScrollView } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import {  useInsertProduct, useProduct, useUpdateProduct } from '@/api/products';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { useAuth } from '@/providers/AuthProvider';
import RemoteImage from '@/components/RemoteImage';

const CreateProductScreen = () =>{
    const tradeTypes : string[] = ['Sale', 'Jeonse', 'Rent'];
    const statusTypes : string[] = ['Active', 'Sold', 'Process'];
    const {session, loading, profile} = useAuth();
    const [image, setImage] = useState<string | null>(null);
    const [dong, setDong] = useState('');
    const [ho, setHo] = useState('');
    const [features, setFeatures] = useState('');
    const [floor, setFloor] = useState('');
    const [house_type, setHouseType] = useState('');
    const [jeonse_price, setJeonsePrice] = useState('');
    const [rent_deposit, setRentDeposit] = useState('');
    const [rent_price, setRentPrice] = useState('');
    const [sale_price, setSalePrice] = useState('');
    const [size, setSize] = useState('');
    const [status, setStatus] = useState('');
    const [owner, setOwner] = useState('');
    const [phone, setPhone] = useState('');

    const [errors, setErrors]=  useState('')


    const [selectedApartment , setSelectedApartment] = useState<any>(null)
    const [apartmentsData , setApartmentsData] = useState<any[]>([])
    const [trade_type, setTradeType] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(
        typeof idString === 'string' ? idString : idString?.[0]
    );
    const isUpdating = !!idString;

    const { mutate: insertProduct } = useInsertProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    const { data: updatingProduct } = useProduct(profile.workspace, id);
    const defalutImageUri = "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 

    const router = useRouter();

    useEffect(() => {
        if (updatingProduct) {
            setDong(updatingProduct.dong.toString());
            setSelectedApartment(updatingProduct.apartments);
            setHo(updatingProduct.ho.toString());
            setFeatures(updatingProduct.features);
            setFloor(updatingProduct.floor.toString());
            setHouseType(updatingProduct.house_type);
            setJeonsePrice(updatingProduct.jeonse_price?.toString());
            setRentDeposit(updatingProduct.rent_deposit?.toString());
            setRentPrice(updatingProduct.rent_price?.toString());
            setSalePrice(updatingProduct.sale_price?.toString());
            setSize(updatingProduct.size?.toString());
            setStatus(updatingProduct.status);
            setTradeType(updatingProduct.trade_type);
            setImage(updatingProduct.image);
            setOwner(updatingProduct.owner);
            setPhone(updatingProduct.phone);
        }

        
    }, [updatingProduct]);

    useEffect(() => {
        const fetchApartments = async () => {
            let { data: apartments, error } = await supabase
            .from('apartments')
            .select('*')

            setApartmentsData(apartments!)

        }
        fetchApartments()

    }, []);

    const onSubmit = () => {
        if(isUpdating) {
            onUpdate();
        }else {
            onCreate();
        }
    }

    const addApartment = () => {
        router.push('/(tabs)/products/create_apart')
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
    };

    const resetFields = () => {
        setDong('');
        setHo('');
        setFeatures('');
        setFloor('');
        setHouseType('');
        setJeonsePrice('');
        setRentDeposit('');
        setRentPrice('');
        setSalePrice('');
        setSize('');
        setStatus('');
        setTradeType('');
        setOwner('');
        setPhone('');
        setImage(null);
    }

    const validateInput = () => {
        let errorMessage = ""

        if (!selectedApartment) {
            errorMessage = 'Not a valid apartment';
            setErrors(errorMessage);
            return false;
        }
        if (dong) {
            if(isNaN(Number(dong))) {
                errorMessage = 'Not a valid dong';
                setErrors(errorMessage);
                return false;
            }
        }

        if (ho) {
            if (isNaN(Number(ho))) {
                errorMessage = 'Not a valid ho';
                setErrors(errorMessage);
                return false;
            }
        }

        if (floor) {
            if (isNaN(Number(floor))) {
                errorMessage = 'Not a valid floor';
                setErrors(errorMessage);
                return false;
            }
        }

        if (!house_type) {
            errorMessage = 'House type is required';
            setErrors(errorMessage);
            return false;
        }

        if (jeonse_price != "" && jeonse_price != undefined && isNaN(Number(jeonse_price))) {
            errorMessage = 'Not a valid Jeonse price';
            setErrors(errorMessage);
            return false;
        }

        if (rent_deposit != "" && rent_deposit != undefined && isNaN(Number(rent_deposit))) {
            errorMessage = 'Not a valid rent deposit';
            setErrors(errorMessage);
            return false;
        }

        if (rent_price != "" && rent_price != undefined && isNaN(Number(rent_price))) {
            errorMessage = 'Not a valid rent price';
            setErrors(errorMessage);
            return false;
        }

        if (sale_price != "" && sale_price != undefined && isNaN(Number(sale_price))) {
            errorMessage = 'Not a valid sale price';
            setErrors(errorMessage);
            return false;
        }

        if (size && isNaN(Number(size))) {
            errorMessage = 'Not a valid size';
            setErrors(errorMessage);
            return false;
        }

        if (!status) {
            errorMessage = 'Status is required';
            setErrors(errorMessage);
            return false;
        }

        if (!trade_type) {
            errorMessage = 'Trade type is required';
            setErrors(errorMessage);
            return false;
        } 
        if (!owner) {
            errorMessage = 'Owner is required';
            setErrors(errorMessage);
            return false;
        } 

        if (!phone) {
            errorMessage = 'Phone is required';
            setErrors(errorMessage);
            return false;
        } 

        return true;
    }

    const onCreate = async () => {
        if( !validateInput()) {
            Alert.alert('Invalid input', errors);
            return;
        }

        setIsLoading(true);

        const imagePath = await uploadImage();

        insertProduct(
            {   
                apartment: selectedApartment.id,
                dong,
                ho,
                features,
                floor,
                house_type,
                jeonse_price: jeonse_price === "" ? null: jeonse_price,
                rent_deposit: rent_deposit === "" ? null: rent_deposit,
                rent_price: rent_price === "" ? null: rent_price,
                sale_price: sale_price === "" ? null: sale_price,
                size,
                status,
                trade_type,
                workspace: profile.workspace,
                image: imagePath,
                owner,
                phone
            },
            {
                onSuccess: () => {
                resetFields();
                },
            }
        );
        setIsLoading(false);
        router.back();
    }

    const onUpdate = async () => {
        if( !validateInput()) {
            Alert.alert('Invalid input', errors);
            return;
        }

        setIsLoading(true);
        const imagePath = await uploadImage();

        let updatedFields = {
            apartment: selectedApartment.id,
            dong,
            ho,
            features,
            floor,
            house_type,
            jeonse_price: jeonse_price === "" ? null: jeonse_price,
            rent_deposit: rent_deposit === "" ? null: rent_deposit,
            rent_price: rent_price === "" ? null: rent_price,
            sale_price: sale_price === "" ? null: sale_price,
            size,
            status,
            trade_type,
            workspace: profile.workspace,
            image: imagePath,
            owner,
            phone
        }

        updateProduct(
        {   id: idString,
            ...updatedFields
        },
        {
            onSuccess: () => {
                resetFields();
            },
        }
        );

        setIsLoading(false);
        router.back();
    }

    const uploadImage = async () => {
        if (!image?.startsWith('file://')) {
            return;
        }

        const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
        const filePath = `${randomUUID()}.png`;
        const contentType = 'image/png';

        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, decode(base64), { contentType });

        if (data) {
            return data.path;
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{title: isUpdating ? 'Update Product' : 'Create Product'}}/>
            <ScrollView>
                {isUpdating ? (
                    <RemoteImage  
                        path={image}
                        fallback={defalutImageUri}
                        style={styles.image}
                        dataLink='product-images'
                        resizeMode="auto"/>
                ) : (            
                    <Image
                        source={{ uri: image || defalutImageUri }}
                        style={styles.image}
                    />)
                }
                <Text onPress={pickImage} style={styles.textBtn}>Select image</Text>

                <Text style={styles.label}>Status selection</Text>
                <View style={styles.selectionContainer}>
                    {statusTypes.map((statusTypeString) => (
                        <Pressable
                            key={statusTypeString}
                            onPress={() => setStatus(statusTypeString)}
                            style={[
                                styles.selectionButton,
                                status === statusTypeString ? styles.selectedButton : styles.unselectedButton,
                            ]}
                        >
                            <Text
                                style={[
                                    status === statusTypeString ? styles.selectedText : styles.unselectedText,
                                ]}
                            >
                                {statusTypeString}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.label}>Apartment selection</Text>
                <View style={styles.selectionContainer}>
                    {apartmentsData.map((apartmentData) => (
                        <Pressable
                            key={apartmentData.id}
                            onPress={() => setSelectedApartment(apartmentData)}
                            style={[
                                styles.selectionButton,
                                selectedApartment?.id === apartmentData.id ? styles.selectedButton : styles.unselectedButton,
                            ]}
                        >
                            <Text
                                style={[
                                    selectedApartment?.id === apartmentData.id ? styles.selectedText : styles.unselectedText,
                                ]}
                            >
                                {apartmentData.name}
                            </Text>
                        </Pressable>
                    ))}

                    <Pressable onPress={addApartment} style={styles.addApartmentButton}>
                        <Text>+ Create New Apartment</Text>
                    </Pressable>
                </View>

                <TextInput
                    style={styles.input}
                    value={dong}
                    onChangeText={setDong}
                    placeholder='Dong'
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    value={ho}
                    onChangeText={setHo}
                    placeholder='Ho'
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    value={floor}
                    onChangeText={setFloor}
                    placeholder='Floor'
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    value={house_type}
                    onChangeText={setHouseType}
                    placeholder='House Type'
                />
                <TextInput
                    style={styles.input}
                    value={size}
                    onChangeText={setSize}
                    placeholder='Size(45-200 range)'
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Trade type select</Text>
                <View style={styles.selectionContainer}>
                    {tradeTypes.map((tradeTypeString) => (
                        <Pressable
                            key={tradeTypeString}
                            onPress={() => setTradeType(tradeTypeString)}
                            style={[
                                styles.selectionButton,
                                trade_type === tradeTypeString ? styles.selectedButton : styles.unselectedButton,
                            ]}
                        >
                            <Text
                                style={[
                                    trade_type === tradeTypeString ? styles.selectedText : styles.unselectedText,
                                ]}
                            >
                                {tradeTypeString}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {trade_type === 'Sale' && (
                    <TextInput
                        style={styles.input}
                        value={sale_price}
                        onChangeText={setSalePrice}
                        placeholder='Sale Price (90000-400000 range)'
                        keyboardType="numeric"
                    />
                )}
                {trade_type === 'Jeonse' && (
                    <TextInput
                        style={styles.input}
                        value={jeonse_price}
                        onChangeText={setJeonsePrice}
                        placeholder='Jeonse Price (10000- 150000) range'
                        keyboardType="numeric"
                    />
                )}
                {trade_type === 'Rent' && (
                    <>
                        <TextInput
                            style={styles.input}
                            value={rent_deposit}
                            onChangeText={setRentDeposit}
                            placeholder='Rent Deposit (500- 100000 range)'
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={rent_price}
                            onChangeText={setRentPrice}
                            placeholder='Rent Price (10-500 range)'
                            keyboardType="numeric"
                        />
                    </>
                )}

                <TextInput
                    style={styles.input}
                    value={features}
                    onChangeText={setFeatures}
                    placeholder='Features'
                />

                <Text style={styles.label}>Owner detail</Text>
                <TextInput
                    style={styles.input}
                    value={owner}
                    onChangeText={setOwner}
                    placeholder='Owner name'
                />
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder='Owner phone number'
                    keyboardType="numeric"
                />

                {!isLoading ? <Button onPress={onSubmit} text={isUpdating ? "Update" : 'Create'} /> : <Text>Loading</Text>}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20,
        marginHorizontal: 10,
    },
    label: {
        color: 'grey',
        fontSize: 16,
    },
    image: {
        width: '100%',
        aspectRatio: 4 / 3,
    },
    textBtn: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'blue',
    },
    selectionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 10,
    },
    selectionButton: {
        padding: 10,
        borderRadius: 25,
        margin: 5,
        borderWidth: 2,
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
    addApartmentButton: {
        padding: 10,
        borderRadius: 25,
        margin: 5,
        borderWidth: 2,
        borderColor: '#64748B',
    },
});

export default CreateProductScreen;
