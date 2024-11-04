// main.js
import { FormManager } from './managers/FormManager.js';
import { loginFormConfig } from './forms/loginForm.js';

// Initialize managers
const formManager = new FormManager();

// Register forms
formManager.registerForm('loginForm', loginFormConfig);