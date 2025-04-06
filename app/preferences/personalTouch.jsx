import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Button, TextInput, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import { useForm, Controller } from "react-hook-form";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CountryPickerComponent from '../../components/countryPicker';
import TopBar from '../../components/topBar';
import BottomBarContinueBtn from '../../components/buttons/bottomBarContinueBtn';
import TitleSubtitle from '../../components/titleSubtitle';

const PersonalTouch = () => {
    const router = useRouter();
    const [countryCode, setCountryCode] = useState('IN');
    const [country, setCountry] = useState({
        cca2: 'IN',
        name: 'India',
        callingCode: '91'
    });

    const handleCountrySelect = (selectedCountry) => {
        setCountryCode(selectedCountry?.cca2);
        setCountry(selectedCountry);
    };

    const handleDone = () => {
        router.push('/preferences/allSet');
    };

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            firstName: 'Srijan',
            email: 'srijantelang41@gmail.com',
            country: 'India',
            countryCallingCode: '91',
            phoneNumber: '7989787983'
        }
    });

    // Set initial values
    useEffect(() => {
        setValue('firstName', 'Srijan');
        setValue('email', 'srijantelang41@gmail.com');
        setValue('country', 'India');
        setValue('countryCallingCode', '91');
        setValue('phoneNumber', '7989787983');
    }, [setValue]);

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <TopBar backarrow progress={0.7} />
            <ScrollView className="flex container px-7">
                <TitleSubtitle 
                    title={'Add a personal touch'} 
                    subtitle={"To enhance your travel journey, we'd love to know more about you."} 
                />
                <View className="container">
                    <View style={styles.imageContainer}>
                        <View>
                            <Image 
                                style={[styles.image, { padding: 20 }]} 
                                source={require('../../assets/images/icon.png')} 
                            />
                            <Image 
                                style={styles.imageEditIcon} 
                                source={require('../../assets/images/edit-icon.png')} 
                            />
                        </View>
                    </View>
                    <Text style={styles.label}>First Name</Text>
                    <View>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={styles.input}
                                />
                            )}
                            name="firstName"
                        />
                    </View>
                    {errors.firstName && <Text style={styles.error}>This is required.</Text>}

                    <Text style={styles.label}>Email</Text>
                    <View>
                        <MaterialIcons 
                            name="alternate-email" 
                            size={16} 
                            color="#8f8f8f" 
                            style={styles.emailIcon} 
                        />
                        <Controller
                            control={control}
                            rules={{ required: true, pattern: /^\S+@\S+$/i }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={[styles.input, styles.emailInput]}
                                />
                            )}
                            name="email"
                        />
                    </View>

                    <Text style={styles.label}>Nationality</Text>
                    <View>
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.input}>
                                    <CountryPickerComponent
                                        onSelect={handleCountrySelect}
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                </View>
                            )}
                            name="country"
                        />
                    </View>

                    <View style={styles.phoneContainer}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.countryCode}>
                                    <TextInput 
                                        style={[styles.input, styles.countryCodeInput]} 
                                        editable={false}
                                        value={`+${country?.callingCode}`}
                                    />
                                </View>
                            )}
                            name="countryCallingCode"
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.phoneNumber}>
                                    <TextInput 
                                        style={styles.input}
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                </View>
                            )}
                            name="phoneNumber"
                        />
                    </View>
                </View>
            </ScrollView>
            <BottomBarContinueBtn handleDone={handleDone} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    imageContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    imageEditIcon: {
        position: "absolute",
        height: 25,
        width: 25,
        right: 20,
        bottom: 35,
        borderRadius: 100,
    },
    image: {
        height: 150,
        width: 150,
        marginBottom: 15,
        borderRadius: 100,
        borderColor: '#f1f1f1',
    },
    input: {
        justifyContent: "center",
        borderColor: '#f1f1f1',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 17,
        marginBottom: 20,
        fontSize: 15,
        fontWeight: '500',
        height: 50,
        backgroundColor: '#fff',
    },
    emailIcon: {
        position: "absolute",
        left: 15,
        top: 17,
        zIndex: 1
    },
    emailInput: {
        paddingLeft: 40,
    },
    label: {
        fontSize: 13,
        marginBottom: 5,
        color: 'black',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    phoneContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    countryCode: {
        width: '25%',
    },
    phoneNumber: {
        width: '73%',
    },
    countryCodeInput: {
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
    },
});

export default PersonalTouch;