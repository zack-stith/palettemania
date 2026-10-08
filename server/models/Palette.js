import mongoose from "mongoose";

const paletteSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // TODO Phase 2: make required (once users exist)
        },

        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxLength: [50, "Name must be 50 characters or fewer"],
        },

        colors: {
            type: [String],
            validate: [
                {
                    validator: (colors) => colors.length >= 2 && colors.length <= 8,
                    message: "A palette must have between 2 and 8 colors",
                },
                {
                    validator: (colors) => colors.every((c) => /^#[0-9A-F]{6}$/.test(c)),
                    message: "Invalid hex code",
                },
                {
                    validator: (colors) => new Set(colors).size === colors.length,
                    message: "A palette must not contain duplicate colors",
                },
            ],
            immutable: true,
        },

        isPublic: {
            type: Boolean,
            default: true,
        },

        likeCount: {
            type: Number,
            default: 0,
        },

        retiredAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true } // for createdAt and updatedAt
);

paletteSchema.index({ owner: 1, createdAt: -1, _id: -1 }); // A member's palettes, newest first
paletteSchema.index({ isPublic: 1, createdAt: -1, _id: -1 }); // feed sorted by newest first
paletteSchema.index({ isPublic: 1, likeCount: -1, createdAt: -1, _id: -1 }); // feed sorted by most liked first
paletteSchema.index({ colors: 1, _id: -1 }); // all palettes containing a specified color

const Palette = mongoose.model("Palette", paletteSchema);
export default Palette;