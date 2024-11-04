// FormManager.js
class FormManager {
    constructor() {
        this.forms = {};
        this.setupFormListeners();
    }

    setupFormListeners() {
        // Common form setup logic
        document.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    registerForm(formId, config) {
        this.forms[formId] = {
            validators: config.validators || {},
            onSubmit: config.onSubmit,
            onSuccess: config.onSuccess,
            onError: config.onError
        };
    }

    async handleFormSubmit(e) {
        if (!this.forms[e.target.id]) return;
        
        e.preventDefault();
        const formData = new FormData(e.target);
        const formConfig = this.forms[e.target.id];
        
        if (!this.validateForm(formData, formConfig.validators)) return;

        try {
            const response = await formConfig.onSubmit(formData);
            formConfig.onSuccess?.(response);
        } catch (error) {
            formConfig.onError?.(error);
        }
    }

    validateForm(formData, validators) {
        // Implement validation logic
        return true;
    }
}



export default FormManager;
