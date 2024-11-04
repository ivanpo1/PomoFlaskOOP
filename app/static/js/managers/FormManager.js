export class FormManager {
    constructor() {
        this.forms = {};
    }

    registerForm(formId, config) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Initialize Just-Validate
        const validator = new JustValidate(form, {
            validateBeforeSubmitting: true,
        });

        // Add validation rules
        config.validationRules(validator);

        // Handle form submission
        validator.onSuccess(async (event) => {
            try {
                const formData = new FormData(form);
                const response = await config.onSubmit(formData);
                config.onSuccess?.(response);
            } catch (error) {
                config.onError?.(error);
            }
        });

        this.forms[formId] = validator;
    }
}