import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { z } from 'zod';

// Schemas de Zod
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

const loginSchema = z.object({
  email: z.string().regex(gmailRegex, 'El correo debe ser una dirección válida de Gmail'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().regex(gmailRegex, 'El correo debe ser una dirección válida de Gmail'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Debes confirmar tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

const Layout = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Estados para Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Estados para Registro
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    try {
      loginSchema.parse({
        email: loginEmail,
        password: loginPassword,
      });
      setErrors({});
      setMessage(`✓ Inicio de sesión exitoso con: ${loginEmail}`);
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        e.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        setMessage('');
      }
    }
  };

  const handleRegister = () => {
    try {
      registerSchema.parse({
        firstName,
        lastName,
        email: registerEmail,
        password: registerPassword,
        confirmPassword,
      });
      setErrors({});
      setMessage(`✓ Registro exitoso: ${firstName} ${lastName} (${registerEmail})`);
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        e.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        setMessage('');
      }
    }
  };

  const clearForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setFirstName('');
    setLastName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
    setErrors({});
    setMessage('');
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    clearForm();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Text>

      {isLogin ? (
        // FORMULARIO DE LOGIN
        <View style={styles.form}>
          <Text style={styles.label}>Correo electrónico:</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="correo@gmail.com"
            value={loginEmail}
            onChangeText={setLoginEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Text style={styles.label}>Contraseña:</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Mínimo 6 caracteres"
            value={loginPassword}
            onChangeText={setLoginPassword}
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <View style={styles.buttonContainer}>
            <Button title="Iniciar Sesión" onPress={handleLogin} color="#007AFF" />
          </View>
        </View>
      ) : (
        // FORMULARIO DE REGISTRO
        <View style={styles.form}>
          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="Tu nombre"
            value={firstName}
            onChangeText={setFirstName}
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

          <Text style={styles.label}>Apellido:</Text>
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="Tu apellido"
            value={lastName}
            onChangeText={setLastName}
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

          <Text style={styles.label}>Correo electrónico:</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="correo@gmail.com"
            value={registerEmail}
            onChangeText={setRegisterEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Text style={styles.label}>Contraseña:</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Mínimo 6 caracteres"
            value={registerPassword}
            onChangeText={setRegisterPassword}
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <Text style={styles.label}>Confirmar contraseña:</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          <View style={styles.buttonContainer}>
            <Button title="Registrarse" onPress={handleRegister} color="#34C759" />
          </View>
        </View>
      )}

      {message ? <Text style={styles.successMessage}>{message}</Text> : null}

      <TouchableOpacity onPress={toggleForm} style={styles.toggleButton}>
        <Text style={styles.toggleText}>
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
  successMessage: {
    fontSize: 16,
    marginTop: 20,
    color: '#34C759',
    textAlign: 'center',
    fontWeight: '500',
  },
  toggleButton: {
    marginTop: 20,
    padding: 10,
  },
  toggleText: {
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default Layout;