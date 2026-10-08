export function normalizeHex(input) {
    if (typeof input !== "string") {
        return null;
    } 
    
    let hex = input.trim();
    if (hex.startsWith("#")) {    
        hex = hex.slice(1);
    }

    const sixDigits = /^[0-9a-f]{6}$/i;
    const threeDigits = /^[0-9a-f]{3}$/i;

    if (!sixDigits.test(hex) && !threeDigits.test(hex)) {
        return null;
    }
    
    if (hex.length === 3) {
        let expanded = "";
        for (let i = 0; i<3; i++) {
            const hexChar = hex.charAt(i);
            expanded += hexChar + hexChar;
        }
        hex = expanded;
    }
    
    return "#" + hex.toUpperCase();
}