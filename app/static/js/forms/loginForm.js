// forms/loginForm.js
export const loginFormConfig = {
    validators: {
        username: (value) => {
            if (!value || value.trim().length < 3) {
                return { valid: false, error: 'Username must be at least 3 characters' };
            }
            return { valid: true };
        },
        password: (value) => {
            if (!value || value.length < 4) {
                return { valid: false, error: 'Password is required' };
            }
            return { valid: true };
        }
    },
    onSubmit: async (formData) => {
        const formJson = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formJson)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        return data;
    },
    onSuccess: (data) => {
        if (data.success) {
            localStorage.setItem('username', data.data.username);
            window.location.href = '/timer';
        }
    },
    onError: (error) => {
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    }
};