"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../common/enum/index");
const security_1 = require("../../common/security");
const userSchema = new mongoose_1.default.Schema({
    firstname: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 26
    },
    lastname: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 26
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider == index_1.ProvideEnum.SYSTEM;
        }
    },
    phone: {
        type: String,
    },
    DOB: {
        type: Date
    },
    confirmEmail: {
        type: Date
    },
    image: {
        type: String
    },
    coverImage: {
        type: [String]
    },
    gender: {
        type: Number,
        enum: index_1.GENDERENUM,
        default: index_1.GENDERENUM.FEMALE
    },
    role: {
        type: Number,
        enum: index_1.ROLEENUM,
        default: index_1.ROLEENUM.USER
    },
    provider: {
        type: Number,
        enum: index_1.ProvideEnum,
        default: index_1.ProvideEnum.SYSTEM
    },
    changeCredtialsTime: Date,
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    isPrivate: { type: Boolean, default: false },
    status: { type: Number, enum: index_1.AccountStatusEnum, default: index_1.AccountStatusEnum.ACTIVE },
    changeStatusAt: Date,
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
    strictQuery: true,
});
userSchema.virtual('username').set(function (value) {
    const [firstname, lastname] = value?.split(' ') || [];
    this.set({ firstname, lastname });
}).get(function () {
    return `${this.firstname} ${this.lastname}`;
});
userSchema.pre('save', async function () {
    const that = this;
    if (this.isModified('password')) {
        this.password = await (0, security_1.hash)({ plaintext: this.password });
    }
    if (this.isModified('phone')) {
        this.phone = await (0, security_1.encryption)(this.phone);
    }
});
userSchema.pre(['findOne', 'find', 'countDocuments'], function () {
    const query = this.getFilter();
    if (query.paranoid != false) {
        this.setQuery({ ...query, status: index_1.AccountStatusEnum.ACTIVE });
    }
});
userSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function () {
    const query = this.getFilter();
    const update = this.getUpdate();
    if (update.status == index_1.AccountStatusEnum.ACTIVE) {
        this.setQuery({ ...query, status: { $eq: index_1.AccountStatusEnum.ACTIVE } });
    }
    else if (update.status == index_1.AccountStatusEnum.ARCHIVED) {
        this.setQuery({ ...query, status: { $eq: index_1.AccountStatusEnum.ARCHIVED } });
    }
    if (!update.status && query.paranoid != false) {
        this.setQuery({ ...query, status: { $ne: index_1.AccountStatusEnum.ARCHIVED } });
    }
    this.setUpdate({ ...this.getUpdate(),
        ...(update.status ? { changeStatusAt: new Date() } : {})
    });
});
userSchema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete'], function () {
    const query = this.getFilter();
    if (!query.force) {
        this.setQuery({ ...query, status: { $eq: index_1.AccountStatusEnum.ARCHIVED } });
    }
});
userSchema.pre('insertMany', function (docs) {
    console.log(docs);
});
exports.UserModel = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
