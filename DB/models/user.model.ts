import mongoose, { HydratedDocument } from 'mongoose';
import { AccountStatusEnum, GENDERENUM, ProvideEnum, ROLEENUM } from '../../common/enum/index';
import { IUser } from '../../common/interface/user.interface';
import { encryption, hash } from '../../common/security';

const userSchema = new mongoose.Schema<IUser>({

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
        required: function () :boolean{
            return this.provider==ProvideEnum.SYSTEM

            
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
        enum: GENDERENUM,
        default: GENDERENUM.FEMALE
    },
    role: {
        type: Number,
        enum: ROLEENUM,
        default: ROLEENUM.USER
    }
    ,
    provider: {
        type: Number,
        enum:ProvideEnum,
        default: ProvideEnum.SYSTEM
    },

    changeCredtialsTime:Date,
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPrivate: { type: Boolean, default: false },
      status: {type:Number,enum:AccountStatusEnum,default:AccountStatusEnum.ACTIVE},
      changeStatusAt: Date,

}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
     strictQuery: true,

});

userSchema.virtual('username').set(function (this: any, value: string) {
    const [firstname, lastname] = value?.split(' ') || [];
    this.set({ firstname, lastname });
}).get(function (this: IUser) {
    return `${this.firstname} ${this.lastname}`;
});

   userSchema.pre('save', async function () {
 
    const that=this
   
     if (this.isModified('password')) {
     this.password=await hash({ plaintext: this.password });
     }
     
     if (this.isModified('phone') ) {
         this.phone=await encryption(this.phone as string)
     }

   } )

userSchema.pre(['findOne', 'find','countDocuments'], function () {
    const query = this.getFilter();
    if (query.paranoid!=false) {
       this.setQuery({ ...query, status: AccountStatusEnum.ACTIVE })
       
    }
})
userSchema.pre(['updateOne', 'updateMany','findOneAndUpdate'], function () {
    const query = this.getFilter();
    const update = this.getUpdate() as HUser
    if (update.status==AccountStatusEnum.ACTIVE) {
       this.setQuery({ ...query, status: { $eq:AccountStatusEnum.ACTIVE} })
    }else if (update.status==AccountStatusEnum.ARCHIVED) {
        this.setQuery({ ...query, status: { $eq:AccountStatusEnum.ARCHIVED} })
    }
    if(!update.status&&query.paranoid!=false){
        this.setQuery({ ...query, status: { $ne:AccountStatusEnum.ARCHIVED } })
    }
    this.setUpdate({ ...this.getUpdate()
        , ...(update.status ? { changeStatusAt: new Date() } : {}) 
    })
})
userSchema.pre(['deleteOne', 'deleteMany','findOneAndDelete'], function () {
    const query = this.getFilter();

    if(!query.force){
        this.setQuery({ ...query, status: { $eq:AccountStatusEnum.ARCHIVED } })
    }
 
})
userSchema.pre('insertMany',function(docs:HUser[]) {
    console.log(docs)
})
  
export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export type HUser=HydratedDocument<IUser>