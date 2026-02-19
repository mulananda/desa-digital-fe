// src/composables/useErrorHandler.js
import { ref, readonly } from "vue";
import { errorHandlerService } from "@/services/errorHandler.service";

/**
 * useErrorHandler composable
 *
 * Membungkus errorHandlerService dengan Vue 3 reactive state.
 * Digunakan di component/page untuk menangani error dengan cara idiomatic Vue 3.
 *
 * Usage:
 *   const { validationErrors, errorMessage, handleError, handleSubmit, clearErrors } = useErrorHandler();
 *
 *   // Manual error handling
 *   try { ... } catch (e) { handleError(e) }
 *
 *   // Form submission wrapper
 *   const onSubmit = handleSubmit(async (data) => {
 *     await api.create(data);
 *   });
 */
export function useErrorHandler(defaultOptions = {}) {
  const validationErrors = ref({});
  const errorMessage = ref(null);
  const isError = ref(false);

  /**
   * Handle error dan set reactive state
   * @param {Error} error - Axios error
   * @param {Object} options - Override options
   * @returns {Object|null} - Validation errors atau null
   */
  function handleError(error, options = {}) {
    const mergedOptions = { ...defaultOptions, ...options };
    const result = errorHandlerService.handle(error, mergedOptions);

    if (result) {
      // 422 validation errors
      validationErrors.value = result;
      isError.value = true;
    } else {
      // Non-validation error (400, 500, network, etc.)
      const message = error?.response?.data?.message || error?.message || null;
      errorMessage.value = message;
      isError.value = true;
    }

    return result;
  }

  /**
   * Reset semua error state
   */
  function clearErrors() {
    validationErrors.value = {};
    errorMessage.value = null;
    isError.value = false;
  }

  /**
   * Clear error untuk field tertentu
   * @param {string} field - Nama field yang error-nya mau dihapus
   */
  function clearFieldError(field) {
    const { [field]: _, ...rest } = validationErrors.value;
    validationErrors.value = rest;
  }

  /**
   * Wrapper try/catch untuk form submission
   * Otomatis clear errors sebelum submit, tangkap & set error jika gagal.
   *
   * @param {Function} asyncFn - Async function yang mau di-wrap
   * @param {Object} options - Override options untuk error handler
   * @returns {Function} - Wrapped function
   */
  function handleSubmit(asyncFn, options = {}) {
    return async (...args) => {
      clearErrors();

      try {
        return await asyncFn(...args);
      } catch (error) {
        handleError(error, options);
        return null;
      }
    };
  }

  /**
   * Cek apakah field tertentu ada error
   * @param {string} field
   * @returns {string|undefined}
   */
  function getFieldError(field) {
    const errors = validationErrors.value[field];
    if (Array.isArray(errors)) return errors[0];
    return errors;
  }

  /**
   * Cek apakah ada validation errors
   */
  function hasErrors() {
    return Object.keys(validationErrors.value).length > 0;
  }

  return {
    // State (readonly untuk mencegah mutasi langsung)
    validationErrors: readonly(validationErrors),
    errorMessage: readonly(errorMessage),
    isError: readonly(isError),

    // Actions
    handleError,
    clearErrors,
    clearFieldError,
    handleSubmit,

    // Helpers
    getFieldError,
    hasErrors,
  };
}
