export const mockData = {
  appointments: [
    {
      id: '1',
      clientName: 'John Doe',
      clientPhone: '3001234567',
      clientEmail: 'john@email.com',
      barberId: '1',
      barberName: 'Carlos Rodriguez',
      serviceId: '1',
      serviceName: 'Haircut + Beard',
      siteId: '1',
      siteName: 'Downtown Branch',
      date: '2025-06-28',
      startTime: '10:00',
      endTime: '11:00',
      status: 'confirmed', // translated
      notes: 'Client prefers a modern cut'
    },
    {
      id: '2',
      clientName: 'Ana Garcia',
      clientPhone: '3009876543',
      barberId: '2',
      barberName: 'Luis Martinez',
      serviceId: '2',
      serviceName: 'Classic Cut',
      siteId: '1',
      siteName: 'Downtown Branch',
      date: '2025-06-29',
      startTime: '14:30',
      endTime: '15:30',
      status: 'pending' // translated
    }
  ],
  services: [
    {
      id: '1',
      name: 'Haircut + Beard', // translated
      price: 25000,
      duration: 60,
      description: 'Professional haircut with beard trim', // translated
      image_Url: 'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400',
      isActive: true
    },
    {
      id: '2',
      name: 'Classic Cut', // translated
      price: 15000,
      duration: 30,
      description: 'Traditional gentleman\'s cut', // translated
      image_Url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400',
      isActive: true
    }
  ],
  sites: [
    {
      id: '1',
      name_site: 'Downtown Branch', // translated
      address_site: '12th Street #34-56, Downtown', // translated
      phone_site: '3123456789',
      headquarter_time: 'Mon-Sat: 8:00 AM - 8:00 PM', // translated
      isActive: true
    },
    {
      id: '2',
      name_site: 'North Branch', // translated
      address_site: '45th Avenue #67-89, North', // translated
      phone_site: '3187654321',
      headquarter_time: 'Mon-Sat: 9:00 AM - 7:00 PM', // translated
      isActive: true
    }
  ],
  users: [
    {
      id: '1',
      id_barber: 1001,
      name_barber: 'Carlos',
      last_name_barber: 'Rodriguez', // translated
      role: 'barber', // translated
      site_barber: '1',
      siteName: 'Downtown Branch', // translated
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      isActive: true,
      last_login: '2025-06-27T15:30:00Z'
    },
    {
      id: '2',
      id_barber: 1002,
      name_barber: 'Luis',
      last_name_barber: 'Martinez', // translated
      role: 'barber', // translated
      site_barber: '1',
      siteName: 'Downtown Branch', // translated
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isActive: true,
      last_login: '2025-06-28T09:15:00Z'
    }
  ],
};