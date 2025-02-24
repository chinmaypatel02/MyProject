import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import images from '../utils/images';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Handle sign in button press
    const handleSignIn = () => {
        // Add your authentication logic here
        console.log('Sign in with:', email, password);
        
        // Navigate to Home screen after authentication
        navigation.navigate('Home');
      };

    // Handle social sign in
    const handleSocialSignIn = (provider) => {
        console.log(`Sign in with ${provider}`);
        // Add your social authentication logic here
    };

    // Handle guest sign in
    const handleGuestSignIn = () => {
        console.log('Signing in as guest');
        // Navigation to main app as guest
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* App Title */}
            <Text style={styles.appTitle}>Plié</Text>

            {/* Placeholder Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={images.placeholder}
                    style={styles.placeholderImage}
                    // Fallback for when image doesn't load
                    defaultSource={images.placeholder}
                />
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
                {/* Email Input */}
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="email@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Password Input */}
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                            source={images.eye}
                            style={styles.eyeIcon}
                        />
                    </TouchableOpacity>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPasswordContainer}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Sign In Button */}
                <View style={styles.signInButtonContainer}>
                    <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>

                {/* Sign Up Link */}
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Not a member? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signUpLink}>Sign Up Here</Text>
                    </TouchableOpacity>
                </View>

                {/* Social Sign In */}
                <View style={styles.socialSignInContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.socialSignInText}>or Sign In with:</Text>
                    <View style={styles.divider} />
                </View>

                {/* Social Buttons */}
                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialSignIn('Google')}>
                        <Image
                            source={images.google}
                            style={styles.socialIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialSignIn('Apple')}>
                        <Image
                            source={images.apple}
                            style={styles.socialIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialSignIn('Facebook')}>
                        <Image
                            source={images.facebook}
                            style={styles.socialIcon}
                        />
                    </TouchableOpacity>
                </View>

                {/* Guest Sign In */}
                <TouchableOpacity
                    style={styles.guestSignInButton}
                    onPress={handleGuestSignIn}>
                    <Text style={styles.guestSignInText}>Enter as Guest</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    appTitle: {
        fontSize: width * 0.09,
        fontWeight: '500',
        marginTop: height * 0.03,
        color: '#000',
    },
    imageContainer: {
        marginVertical: height * 0.03,
        alignItems: 'center',
        height: height * 0.1,
    },
    placeholderImage: {
        width: width * 0.15,
        height: width * 0.15,
        resizeMode: 'contain',
    },
    formContainer: {
        width: width * 0.9,
    },
    inputLabel: {
        fontSize: width * 0.04,
        marginBottom: height * 0.005,
        color: '#000',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: width * 0.01,
        padding: height * 0.015,
        marginBottom: height * 0.02,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    passwordContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: width * 0.01,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        padding: height * 0.015,
    },
    eyeIcon: {
        width: width * 0.06,
        height: width * 0.06,
        marginRight: width * 0.025,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginVertical: height * 0.01,
    },
    forgotPasswordText: {
        color: '#666',
        fontSize: width * 0.035,
    },
    signInButtonContainer: {
        alignItems: 'flex-end',
        width: '100%',
        marginVertical: height * 0.02,
      },
      signInButton: {
        backgroundColor: '#2ecc71',
        borderRadius: width * 0.01,
        padding: height * 0.018,
        alignItems: 'center',
        width: width * 0.3, // Smaller width as per Figma design
      },
    signInButtonText: {
        color: '#fff',
        fontSize: width * 0.04,
        fontWeight: '600',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',  // Changed from 'center' to 'flex-end'
        marginVertical: height * 0.01,
      },
    signUpText: {
        color: '#000',
        fontSize: width * 0.035,
    },
    signUpLink: {
        color: '#000',
        fontSize: width * 0.035,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    socialSignInContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: height * 0.02,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    socialSignInText: {
        paddingHorizontal: width * 0.025,
        color: '#666',
        fontSize: width * 0.035,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: height * 0.02,
    },
    socialButton: {
        width: width * 0.125,
        height: width * 0.125,
        borderRadius: width * 0.0625,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: width * 0.04,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    socialIcon: {
        width: width * 0.075,
        height: width * 0.075,
        resizeMode: 'contain',
    },
    guestSignInButton: {
        alignItems: 'center',
        marginVertical: height * 0.02,
        paddingVertical: height * 0.01,
    },
    guestSignInText: {
        color: '#666',
        fontSize: width * 0.035,
    },
});

export default LoginScreen;