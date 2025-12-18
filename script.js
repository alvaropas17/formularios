import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, ref, set, get, child } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = 'Ocultar';
            } else {
                input.type = 'password';
                this.textContent = 'Ver';
            }
        });
    });

    // Verificar estado de autenticación
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('Usuario autenticado:', user.email);
            // Si el usuario está en index.html o register.html, redirigir a una página de bienvenida
            // (puedes crear una página de dashboard o perfil)
        } else {
            console.log('No hay usuario autenticado');
        }
    });

    // Form validation and submission for login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                alert(`¡Bienvenido de nuevo! Has iniciado sesión como: ${user.email}`);
                console.log('Usuario logueado:', user);
                
                // Aquí puedes redirigir a otra página
                // window.location.href = 'dashboard.html';
                
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                let errorMessage = 'Error al iniciar sesión.';
                
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage = 'El correo electrónico no es válido.';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'Esta cuenta ha sido deshabilitada.';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'No existe una cuenta con este correo.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Contraseña incorrecta.';
                        break;
                    case 'auth/invalid-credential':
                        errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
                        break;
                    default:
                        errorMessage = `Error: ${error.message}`;
                }
                
                alert(errorMessage);
            }
        });
    }

    // Form validation for registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const direccion = document.getElementById('direccion').value;
            const nacimiento = document.getElementById('nacimiento').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const lopdAccepted = document.getElementById('lopd').checked;

            // Regex Patterns
            const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            const direccionRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\/-]+$/;
            const nacimientoRegex = /^\d{4}$/;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            let errors = [];

            if (!nombreRegex.test(nombre)) {
                errors.push("El nombre solo debe contener letras y espacios.");
            }

            if (direccion && !direccionRegex.test(direccion)) {
                errors.push("La dirección contiene caracteres no válidos.");
            }

            if (nacimiento && !nacimientoRegex.test(nacimiento)) {
                errors.push("El año de nacimiento debe ser un número de 4 dígitos.");
            }

            if (!emailRegex.test(email)) {
                errors.push("El formato del correo electrónico no es válido.");
            }

            if (password.length < 6) {
                errors.push("La contraseña debe tener al menos 6 caracteres.");
            }

            if (password !== confirmPassword) {
                errors.push("Las contraseñas no coinciden.");
            }

            if (!lopdAccepted) {
                errors.push("Debes aceptar la política de privacidad.");
            }

            if (errors.length > 0) {
                alert(errors.join("\n"));
                return;
            }

            // Si la validación es correcta, registrar en Firebase
            try {
                // Crear usuario en Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Guardar información adicional en Realtime Database
                await set(ref(db, 'usuarios/' + user.uid), {
                    nombre: nombre,
                    direccion: direccion || '',
                    nacimiento: nacimiento || '',
                    email: email,
                    fechaRegistro: new Date().toISOString()
                });
                
                alert("¡Registro exitoso! Tu cuenta ha sido creada.");
                console.log('Usuario registrado:', user);
                
                // Redirigir al login o dashboard
                window.location.href = 'index.html';
                
            } catch (error) {
                console.error('Error al registrar usuario:', error);
                let errorMessage = 'Error al registrar la cuenta.';
                
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'Ya existe una cuenta con este correo electrónico.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'El correo electrónico no es válido.';
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = 'El registro con email/contraseña no está habilitado.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'La contraseña es demasiado débil.';
                        break;
                    default:
                        errorMessage = `Error: ${error.message}`;
                }
                
                alert(errorMessage);
            }
        });
    }
});

// Función para cerrar sesión (puedes llamarla desde donde necesites)
export async function logout() {
    try {
        await signOut(auth);
        alert('Has cerrado sesión correctamente.');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión.');
    }
}
