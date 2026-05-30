import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const PLANS = {
  STARTER: {
    id: process.env.RAZORPAY_STARTER_PLAN_ID!,
    name: "Starter",
    price: 249900,
    label: "₹2,499/mo",
  },
  GROWTH: {
    id: process.env.RAZORPAY_GROWTH_PLAN_ID!,
    name: "Growth",
    price: 649900,
    label: "₹6,499/mo",
  },
  PRO: {
    id: process.env.RAZORPAY_PRO_PLAN_ID!,
    name: "Pro",
    price: 1649900,
    label: "₹16,499/mo",
  },
};
