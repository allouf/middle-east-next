import { DetailedOrder } from '../types';

export const mockDetailedOrders: Record<string, DetailedOrder> = {
  pending: {
    id: 'ORD-8821',
    status: 'pending',
    title: 'Professional logo design for startups with a complete visual identity.',
    description: 'I will design a creative and modern logo that best represents your business, along with the delivery of the source files.',
    category: 'Graphic design',
    rating: 4.9,
    reviewsCount: 125,
    serviceType: 'Fixed',
    deliveryModel: 'REMOTE',
    provider: {
      id: 'p1',
      name: 'Studio Creative Lab',
      role: 'UI/UX Designer',
      avatar: '/anonymous.png'
    },
    orderDate: '2023-10-24T10:00:00Z',
    deliveryDays: 3,
    totalPrice: 52.50,
    servicePrice: 50.00,
    vat: 2.50,
    fees: 0.00,
    serviceNotes: 'We are looking for a clean, modern, and minimalist brand identity for our new eco-conscious tech startup "GreenByte". The color palette should focus on primary greens and soft neutrals.',
    requirementFiles: [
      { name: 'Brand_Vision.pdf', type: 'pdf', url: '#' },
      { name: 'Moodboard.png', type: 'png', url: '#' }
    ]
  },
  in_progress: {
    id: 'ORD-8822',
    status: 'in_progress',
    title: 'Professional logo design for startups with a complete visual identity.',
    description: 'I will design a creative and modern logo that best represents your business, along with the delivery of the source files.',
    category: 'Graphic design',
    rating: 4.9,
    reviewsCount: 125,
    serviceType: 'Fixed',
    deliveryModel: 'REMOTE',
    provider: {
      id: 'p1',
      name: 'Studio Creative Lab',
      role: 'UI/UX Designer',
      avatar: '/anonymous.png'
    },
    orderDate: '2023-10-24T10:00:00Z',
    deliveryDays: 3,
    totalPrice: 52.50,
    servicePrice: 50.00,
    vat: 2.50,
    fees: 0.00,
    serviceNotes: 'We are looking for a clean, modern, and minimalist brand identity for our new eco-conscious tech startup "GreenByte". The color palette should focus on primary greens and soft neutrals.',
    requirementFiles: [
      { name: 'Brand_Vision.pdf', type: 'pdf', url: '#' },
      { name: 'Moodboard.png', type: 'png', url: '#' }
    ]
  },
  completed: {
    id: 'ORD-8823',
    status: 'completed',
    title: 'Professional logo design for startups with a complete visual identity.',
    description: 'I will design a creative and modern logo that best represents your business, along with the delivery of the source files.',
    category: 'Graphic design',
    rating: 4.9,
    reviewsCount: 125,
    serviceType: 'Fixed',
    deliveryModel: 'REMOTE',
    provider: {
      id: 'p1',
      name: 'Studio Creative Lab',
      role: 'UI/UX Designer',
      avatar: '/anonymous.png'
    },
    orderDate: '2023-10-24T10:00:00Z',
    deliveryDays: 3,
    totalPrice: 52.50,
    servicePrice: 50.00,
    vat: 2.50,
    fees: 0.00,
    serviceNotes: 'We are looking for a clean, modern, and minimalist brand identity for our new eco-conscious tech startup "GreenByte". The color palette should focus on primary greens and soft neutrals.',
    requirementFiles: [
      { name: 'Brand_Vision.pdf', type: 'pdf', url: '#' },
      { name: 'Moodboard.png', type: 'png', url: '#' }
    ],
    deliveryMessage: "Hi there! I've just uploaded the final assets for your brand identity. Let me know if everything looks good or if you need any small adjustments. Enjoy!",
    deliveredAt: '2 hours ago',
    deliveryFiles: [
      { name: 'Brand_Vision.pdf', type: 'pdf', url: '#' },
      { name: 'Moodboard.png', type: 'png', url: '#' }
    ]
  }
};
