import mongoose, { mongo } from "mongoose";

const ledgerSchema=new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [ true, "Ledger must be associated with an account" ],
        index: true,
        immutable: true

    },
    amount: {
        type: Number,
        required: [ true, "Amount is required for creating a ledger entry" ],
        immutable: true

    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:true,
        index:true,
    },
    type: {

        type: String,
        enum: {
        values: [ "CREDIT", "DEBIT" ],
        message: "Type can be either CREDIT or DEBIT",
        },
        required: [ true, "Ledger type is required" ],
        immutable: true
},


},{
    timestamps:true
})

function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);

const ledgerModel=mongoose.model("ledger",ledgerSchema)

export default ledgerModel;
