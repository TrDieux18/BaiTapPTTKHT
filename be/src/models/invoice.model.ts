import mongoose, { Schema, Document } from "mongoose";

export interface IInvoice extends Document {
   userId: mongoose.Types.ObjectId;
   products: {
      productId: mongoose.Types.ObjectId;
      quantity: number;
      price: number;
   }[];
   totalAmount: number;
   createdAt: Date;
}

const InvoiceSchema: Schema = new Schema(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      products: [
         {
            productId: {
               type: Schema.Types.ObjectId,
               ref: "Product",
               required: true,
            },
            quantity: {
               type: Number,
               required: true,
            },
            price: {
               type: Number,
               required: true,
            },
         },
      ],
      totalAmount: {
         type: Number,
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

export default mongoose.model<IInvoice>("Invoice", InvoiceSchema);
