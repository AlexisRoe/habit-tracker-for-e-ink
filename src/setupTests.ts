import "fake-indexeddb/auto";
import "@testing-library/jest-dom/vitest";

// jsdom's ElementInternals is missing the form-association APIs
// (setFormValue, setValidity, ...) that our form-associated custom
// elements (e-input, e-textarea, ...) rely on. Stub them so those
// elements can mount in tests.
if (typeof ElementInternals !== "undefined" && !("setFormValue" in ElementInternals.prototype)) {
  Object.assign(ElementInternals.prototype, {
    setFormValue() {},
    setValidity() {},
    checkValidity() {
      return true;
    },
    reportValidity() {
      return true;
    },
  });
  Object.defineProperties(ElementInternals.prototype, {
    form: { get: () => null },
    validity: { get: () => ({}) },
    validationMessage: { get: () => "" },
    willValidate: { get: () => true },
  });
}
