import { FormManager } from './managers/FormManager.js';
import { loginFormConfig } from './forms/loginForm.js';
import { registerFormConfig } from './forms/registerForm.js';

// Initialize managers
const formManager = new FormManager();

// Register forms
formManager.registerForm('loginForm', loginFormConfig);
formManager.registerForm('registerForm', registerFormConfig);