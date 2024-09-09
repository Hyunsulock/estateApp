import { supabase } from '@/lib/supabase';
import { Slider } from '@miblanchard/react-native-slider';
import { Link, router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';

export default function User() {
    const tradeTypes: string[] = ['Sale', 'Jeonse', 'Rent'];
    const statusTypes: string[] = ['Active', 'Sold', 'Process'];
    const { session, loading, profile, setProfile } = useAuth();
    const queryClient = useQueryClient();
    const [selectedApartments, setSelectedApartments] = useState<any[]>([]);
    const [apartmentsData, setApartmentsData] = useState<any[]>([]);
    const [sizeValue, setSizeValue] = useState<number[]>([45, 100]);
    const [salePriceValue, setSalePriceValue] = useState<number[]>([90000, 250000]);
    const [jeonsePriceValue, setJeonsePriceValue] = useState<number[]>([10000, 150000]);
    const [rentPriceValue, setRentPriceValue] = useState<number[]>([10, 500]);
    const [rentDepositPriceValue, setRentDepositPriceValue] = useState<number[]>([500, 100000]);
    const [tradeType, setTradeType] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<any[]>([]);

    useEffect(() => {
        const fetchApartments = async () => {
            let { data: apartments } = await supabase
                .from('apartments')
                .select('*');
            setApartmentsData(apartments!);
        };

        const loadSavedFilters = async () => {
            try {
                const [
                    savedSizeValue,
                    savedSalePriceValue,
                    savedJeonsePriceValue,
                    savedRentPriceValue,
                    savedRentDepositPriceValue,
                    savedTradeType,
                    savedSelectedStatus,
                    savedSelectedApartments,
                ] = await Promise.all([
                    AsyncStorage.getItem('sizeValue'),
                    AsyncStorage.getItem('salePriceValue'),
                    AsyncStorage.getItem('jeonsePriceValue'),
                    AsyncStorage.getItem('rentPriceValue'),
                    AsyncStorage.getItem('rentDepositPriceValue'),
                    AsyncStorage.getItem('tradeType'),
                    AsyncStorage.getItem('selectedStatus'),
                    AsyncStorage.getItem('selectedApartments'),
                ]);

                if (savedSelectedApartments) setSelectedApartments(JSON.parse(savedSelectedApartments));
                if (savedSelectedStatus) setSelectedStatus(JSON.parse(savedSelectedStatus));
                if (savedTradeType) setTradeType(JSON.parse(savedTradeType));
                if (savedSizeValue) setSizeValue(JSON.parse(savedSizeValue));
                if (savedSalePriceValue) setSalePriceValue(JSON.parse(savedSalePriceValue));
                if (savedJeonsePriceValue) setJeonsePriceValue(JSON.parse(savedJeonsePriceValue));
                if (savedRentPriceValue) setRentPriceValue(JSON.parse(savedRentPriceValue));
                if (savedRentDepositPriceValue) setRentDepositPriceValue(JSON.parse(savedRentDepositPriceValue));
            } catch (err) {
                console.error('Error loading saved filters:', err);
            }
        };

        fetchApartments();
        loadSavedFilters();
    }, []);

    const saveFilters = async () => {
        try {
            await AsyncStorage.setItem('selectedApartments', JSON.stringify(selectedApartments));
            await AsyncStorage.setItem('selectedStatus', JSON.stringify(selectedStatus));
            await AsyncStorage.setItem('tradeType', JSON.stringify(tradeType));
            await AsyncStorage.setItem('sizeValue', JSON.stringify(sizeValue));
            await AsyncStorage.setItem('salePriceValue', JSON.stringify(salePriceValue));
            await AsyncStorage.setItem('jeonsePriceValue', JSON.stringify(jeonsePriceValue));
            await AsyncStorage.setItem('rentPriceValue', JSON.stringify(rentPriceValue));
            await AsyncStorage.setItem('rentDepositPriceValue', JSON.stringify(rentDepositPriceValue));
        } catch (err) {
            console.error('Error saving filters:', err);
        } finally {
            await queryClient.invalidateQueries(['products', profile.workspace]);
            router.back();
        }
    };

    const toggleApartment = (toggledApartment: any) => {
        if (selectedApartments.some(apartment => apartment.id === toggledApartment.id)) {
            setSelectedApartments(prevAparts => prevAparts.filter(apartment => apartment.id !== toggledApartment.id));
        } else {
            setSelectedApartments(prevAparts => [...prevAparts, toggledApartment]);
        }
    };

    const toggleStatus = (status: string) => {
        if (selectedStatus.includes(status)) {
            setSelectedStatus(prevStatus => prevStatus.filter(s => s !== status));
        } else {
            setSelectedStatus(prevStatus => [...prevStatus, status]);
        }
    };

    return (
        <>
            <ImageBackground source={require('../../../../assets/waiting.jpg')} style={styles.background}>
                <Stack.Screen
                    options={{
                        title: 'My Filter',
                        headerStyle: { backgroundColor: '#4299e1' },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold' },
                    }}
                />

                <ScrollView>
                    <Text style={styles.sectionTitle}>Apartment selection</Text>
                    <View style={styles.selectionContainer}>
                        {apartmentsData.map(apartment => (
                            <Pressable
                                key={apartment.id}
                                onPress={() => toggleApartment(apartment)}
                                style={[
                                    styles.apartmentButton,
                                    selectedApartments.some(selectedApartment => selectedApartment.id === apartment.id)
                                        ? styles.selectedButton
                                        : styles.unselectedButton,
                                ]}
                            >
                                <Text
                                    style={[
                                        selectedApartments.some(selectedApartment => selectedApartment.id === apartment.id)
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    {apartment.name}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Status selection</Text>
                    <View style={styles.selectionContainer}>
                        {statusTypes.map((statusTypeString) => (
                            <Pressable
                                key={statusTypeString}
                                onPress={() => toggleStatus(statusTypeString)}
                                style={[
                                    styles.statusButton,
                                    selectedStatus.includes(statusTypeString)
                                        ? styles.selectedButton
                                        : styles.unselectedButton,
                                ]}
                            >
                                <Text
                                    style={[
                                        selectedStatus.includes(statusTypeString)
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    {statusTypeString}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Trade type select</Text>
                    <View style={styles.selectionContainer}>
                        {tradeTypes.map(tradeTypeString => (
                            <Pressable
                                key={tradeTypeString}
                                onPress={() => setTradeType([tradeTypeString])}
                                style={[
                                    styles.tradeButton,
                                    tradeType[0] === tradeTypeString
                                        ? styles.selectedButton
                                        : styles.unselectedButton,
                                ]}
                            >
                                <Text
                                    style={[
                                        tradeType[0] === tradeTypeString
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    {tradeTypeString}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Size range {sizeValue[0]} - {sizeValue[1]} m²</Text>
                    <View style={styles.sliderContainer}>
                        <Slider
                            animateTransitions
                            value={sizeValue}
                            onValueChange={setSizeValue}
                            maximumTrackTintColor="#d3d3d3"
                            maximumValue={200}
                            minimumTrackTintColor="#4299e1"
                            minimumValue={45}
                            step={2}
                            thumbTintColor="#4299e1"
                            thumbStyle={styles.thumbStyle}
                            trackStyle={styles.trackStyle}
                        />
                    </View>

                    {tradeType[0] === 'Sale' && (
                        <>
                            <Text style={styles.sectionTitle}>Sale price range {salePriceValue[0]} - {salePriceValue[1]} ₩</Text>
                            <View style={styles.sliderContainer}>
                                <Slider
                                    animateTransitions
                                    value={salePriceValue}
                                    onValueChange={setSalePriceValue}
                                    maximumTrackTintColor="#d3d3d3"
                                    maximumValue={250000}
                                    minimumTrackTintColor="#4299e1"
                                    minimumValue={90000}
                                    step={1000}
                                    thumbTintColor="#4299e1"
                                    thumbStyle={styles.thumbStyle}
                                    trackStyle={styles.trackStyle}
                                />
                            </View>
                        </>
                    )}

                    {tradeType[0] === 'Jeonse' && (
                        <>
                            <Text style={styles.sectionTitle}>Jeonse price range {jeonsePriceValue[0]} - {jeonsePriceValue[1]} ₩</Text>
                            <View style={styles.sliderContainer}>
                                <Slider
                                    animateTransitions
                                    value={jeonsePriceValue}
                                    onValueChange={setJeonsePriceValue}
                                    maximumTrackTintColor="#d3d3d3"
                                    maximumValue={150000}
                                    minimumTrackTintColor="#4299e1"
                                    minimumValue={10000}
                                    step={1000}
                                    thumbTintColor="#4299e1"
                                    thumbStyle={styles.thumbStyle}
                                    trackStyle={styles.trackStyle}
                                />
                            </View>
                        </>
                    )}

                    {tradeType[0] === 'Rent' && (
                        <>
                            <Text style={styles.sectionTitle}>Rent price range {rentPriceValue[0]} - {rentPriceValue[1]} ₩</Text>
                            <View style={styles.sliderContainer}>
                                <Slider
                                    animateTransitions
                                    value={rentPriceValue}
                                    onValueChange={setRentPriceValue}
                                    maximumTrackTintColor="#d3d3d3"
                                    maximumValue={500}
                                    minimumTrackTintColor="#4299e1"
                                    minimumValue={10}
                                    step={5}
                                    thumbTintColor="#4299e1"
                                    thumbStyle={styles.thumbStyle}
                                    trackStyle={styles.trackStyle}
                                />
                            </View>

                            <Text style={styles.sectionTitle}>Rent deposit price range {rentDepositPriceValue[0]} - {rentDepositPriceValue[1]} ₩</Text>
                            <View style={styles.sliderContainer}>
                                <Slider
                                    animateTransitions
                                    value={rentDepositPriceValue}
                                    onValueChange={setRentDepositPriceValue}
                                    maximumTrackTintColor="#d3d3d3"
                                    maximumValue={100000}
                                    minimumTrackTintColor="#4299e1"
                                    minimumValue={500}
                                    step={500}
                                    thumbTintColor="#4299e1"
                                    thumbStyle={styles.thumbStyle}
                                    trackStyle={styles.trackStyle}
                                />
                            </View>
                        </>
                    )}

                    <Pressable onPress={saveFilters} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Save Filters</Text>
                    </Pressable>
                </ScrollView>
            </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        height: '100%',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        marginLeft: 12,
    },
    selectionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 8,
        marginLeft: 4,
    },
    apartmentButton: {
        padding: 10,
        borderRadius: 20,
        margin: 4,
    },
    statusButton: {
        padding: 10,
        borderRadius: 20,
        margin: 4,
        paddingHorizontal: 20,
    },
    tradeButton: {
        padding: 10,
        borderRadius: 20,
        margin: 4,
        paddingHorizontal: 32,
    },
    selectedButton: {
        backgroundColor: '#BFDBFE',
        borderColor: '#4299e1',
        borderWidth: 2,
    },
    unselectedButton: {
        backgroundColor: 'transparent',
        borderColor: '#D1D5DB',
        borderWidth: 2,
    },
    selectedText: {
        color: '#4299e1',
    },
    unselectedText: {
        color: '#64748B',
    },
    sliderContainer: {
        marginBottom: 8,
        marginHorizontal: 16,
    },
    thumbStyle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    trackStyle: {
        height: 4,
        borderRadius: 2,
    },
    saveButton: {
        backgroundColor: '#4299e1',
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 9999, // Full rounded button
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
