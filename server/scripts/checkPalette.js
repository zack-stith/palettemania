import Palette from "../models/Palette.js";

// Scratch tool for checking Palette Schema functionality

const p = new Palette({ name: "Sunshine", colors: ["#F45E1C", "#300C15"] });
const err = p.validateSync();
console.log(err ? Object.values(err.errors).map(e => e.message) : "valid ✅");


const p1 = new Palette({ name: "inty", colors: [32] });
const err1 = p1.validateSync();
console.log(err1 ? Object.values(err1.errors).map(e => e.message) : "valid ✅");

const p2 = new Palette({ name: "nuttin", colors: ["#ababab", "#ffffff", "#F3ac90"] });
const err2 = p2.validateSync();
console.log(err2 ? Object.values(err2.errors).map(e => e.message) : "valid ✅");

const p3 = new Palette({ name: "too much", colors: ["#012345", "#123456", "#234567", "#345678", "#456789", "#56789A", "#6789AB", "#789ABC", "#89ABCD"] });
const err3 = p3.validateSync();
console.log(err3 ? Object.values(err3.errors).map(e => e.message) : "valid ✅");

const p4 = new Palette({ name: "too little", colors: ["#79B79B", "#79B79B"] });
const err4 = p4.validateSync();
console.log(err4 ? Object.values(err4.errors).map(e => e.message) : "valid ✅");

const p5 = new Palette({ name: "qwertyuiopasdfghjklzxcvbn mqwertyuiopasdfghjklzxcvbnm", colors: ["#998855", "#912121", "#9FFFD1"]});
const err5 = p5.validateSync();
console.log(err5 ? Object.values(err5.errors).map(e => e.message) : "valid ✅");