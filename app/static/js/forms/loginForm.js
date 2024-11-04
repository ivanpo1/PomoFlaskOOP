// forms/loginForm.js
export const loginFormConfig = {
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
            ]);
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