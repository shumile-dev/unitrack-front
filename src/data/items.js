// Central dummy data file for items
export const foundItems = [
  {
    id: 1,
    type: 'found',
    title: 'Blue Backpack',
    description: 'Found near the main gate on 12 April.',
    image: 'https://i.pinimg.com/736x/75/53/d7/7553d73e59517c4d98c1011681762f73.jpg',
    location: 'Main Gate',
    date: '2025-04-12',
    reporter: 'Sara Ahmed'
  },
  {
    id: 2,
    type: 'found',
    title: 'Silver Watch',
    description: 'Found in the Library on 9 April.',
    image: 'https://i.pinimg.com/736x/c6/ce/51/c6ce511b028c7ef0c15335a3f7e69158.jpg',
    location: 'Library',
    date: '2025-04-09',
    reporter: 'Kashan Ali'
  },
  {
    id: 3,
    type: 'found',
    title: 'Pen Drive',
    description: 'Found in Lecture Hall 3 after class on 11 April.',
    image: 'https://i.pinimg.com/736x/ae/10/39/ae1039f55debb8913dd732c42412517f.jpg',
    location: 'Lecture Hall 3',
    date: '2025-04-11',
    reporter: 'Ayesha Zafar'
  }
];

export const lostItems = [
  {
    id: 4,
    type: 'lost',
    title: 'Black Wallet',
    description: 'Lost near the cafeteria on 10 April.',
    image: 'https://i.pinimg.com/736x/75/53/d7/7553d73e59517c4d98c1011681762f73.jpg',
    location: 'Cafeteria',
    date: '2025-04-10',
    reporter: 'Ali Khan'
  },
  {
    id: 5,
    type: 'lost',
    title: 'Red Umbrella',
    description: 'Lost in Lecture Hall 2 on 8 April.',
    image: 'https://i.pinimg.com/736x/c6/ce/51/c6ce511b028c7ef0c15335a3f7e69158.jpg',
    location: 'Lecture Hall 2',
    date: '2025-04-08',
    reporter: 'Fatima Noor'
  },
  {
    id: 6,
    type: 'lost',
    title: 'Keys Keychain',
    description: 'Lost outside the admin block on 11 April.',
    image: 'https://i.pinimg.com/736x/ae/10/39/ae1039f55debb8913dd732c42412517f.jpg',
    location: 'Admin Block',
    date: '2025-04-11',
    reporter: 'Omar Rizwan'
  }
];

export const allItems = [...foundItems, ...lostItems]; 