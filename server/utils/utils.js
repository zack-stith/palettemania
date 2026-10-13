export function validationMessage(err) {
    return Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
}