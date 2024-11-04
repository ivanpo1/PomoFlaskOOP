// forms/registerForm.js
export const registerFormConfig = {
    validationRules: (validator) => {
        validator
            .addField('#username', [
                {
                    rule: 'required',
                    errorMessage: 'Username is required'
                },
                {
                    rule: 'minLength',
                    value: 3,
                    errorMessage: 'Username must be at least 3 characters'
                }
            ])
            .addField('#password', [
                {
                    rule: 'required',
                    errorMessage: 'Password is required'
                },
                {
                    rule: 'minLength',
                    value: 4,
                    errorMessage: 'Password must be at least 4 characters'
                }
            ])
            .addField('#confirmation', [
                {
                    rule: 'required',
                    errorMessage: 'Please confirm your password'
                },
                {
                    validator: (value, fields) => {
                        return value === fields['#password'].elem.value;
                    },
                    errorMessage: 'Passwords should match'
                }
            ]);
    },
    onSubmit: async (formData) => {
        const formJson = {
            username: formData.get('username'),
            password: formData.get('password'),
            confirmation: formData.get('confirmation')
        };

        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formJson)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        return data;
    },
    onSuccess: (data) => {
        if (data.success) {
            window.location.href = '/auth/login';
        }
    },
    onError: (error) => {
        const errorElement = document.getElementById('register-error');
        if (errorElement) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    }
};