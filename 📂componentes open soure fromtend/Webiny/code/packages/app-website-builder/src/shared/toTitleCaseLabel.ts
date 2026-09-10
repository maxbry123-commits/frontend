export function toTitleCaseLabel(input: string): string {
    // Convert camelCase to spaced: "originalSize" → "original Size"
    const spaced = input.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Split by space, capitalize each word
    return spaced
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
