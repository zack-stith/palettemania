import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minLength: [3, "Username must be between 3 and 20 characters"],
            maxLength: [20, "Username must be between 3 and 20 characters"],
            match: [/^[A-Za-z0-9_]+$/, "Username may only contain letters, digits, and underscores"],
        },

        usernameLower: {
            type: String,
            unique: true,
        },

        email: {
            type: String,
            lowercase: true,
            required: [true, "Email address is required"],
            trim: true,
            unique: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
        },

        passwordHash: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.passwordHash;
                delete ret.usernameLower;
                delete ret.__v;
                return ret;
            }
        }
    }
);

userSchema.pre("validate", function() {
    if (this.username) {
        this.usernameLower = this.username.toLowerCase();
    }
});

const User = mongoose.model("User", userSchema);
export default User;