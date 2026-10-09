import { Order } from '../types';

export const mockOrders: Order[] = [
  {
    id: "ORD-8921",
    status: "pending",
    escrowStatus: "in_escrow",
    title: "Professional logo design for startups with a complete visual identity.",
    provider: {
      id: "p1",
      name: "Souad Ahmad",
      avatar: "/anonymous.png",
      role: "UI/UX Designer",
    },
    orderDate: "2023-05-24T00:00:00Z",
    deliveryDays: 3,
    totalPrice: 52.50,
    imageUrl: "/anonymous.png"
  },
  {
    id: "ORD-8922",
    status: "in_progress",
    escrowStatus: "in_escrow",
    title: "Professional logo design for startups with a complete visual identity.",
    provider: {
      id: "p2",
      name: "Souad Ahmad",
      avatar: "/anonymous.png",
      role: "UI/UX Designer",
    },
    orderDate: "2023-05-24T00:00:00Z",
    deliveryDays: 3,
    totalPrice: 52.50,
    imageUrl: "/anonymous.png"
  },
  {
    id: "ORD-8923",
    status: "completed",
    escrowStatus: "in_escrow",
    title: "Professional logo design for startups with a complete visual identity.",
    provider: {
      id: "p3",
      name: "Souad Ahmad",
      avatar: "/anonymous.png",
      role: "UI/UX Designer",
    },
    orderDate: "2023-05-24T00:00:00Z",
    deliveryDays: 3,
    totalPrice: 52.50,
    imageUrl: "/anonymous.png"
  },
  {
    id: "ORD-8924",
    status: "completed",
    escrowStatus: "paid",
    title: "Professional logo design for startups with a complete visual identity.",
    provider: {
      id: "p4",
      name: "Souad Ahmad",
      avatar: "/anonymous.png",
      role: "UI/UX Designer",
    },
    orderDate: "2023-05-26T00:00:00Z",
    deliveryDays: 3,
    totalPrice: 52.50,
    imageUrl: "/anonymous.png"
  },
  {
    id: "ORD-8925",
    status: "rejected",
    escrowStatus: "in_escrow",
    title: "Professional logo design for startups with a complete visual identity.",
    provider: {
      id: "p5",
      name: "Souad Ahmad",
      avatar: "/anonymous.png",
      role: "UI/UX Designer",
    },
    orderDate: "2023-05-26T00:00:00Z",
    deliveryDays: 3,
    totalPrice: 52.50,
    rejectionReason: "Service currently unavailable",
    imageUrl: "/anonymous.png"
  }
];
