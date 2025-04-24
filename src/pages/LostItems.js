import React from "react";
import Card from "../components/Card";

const LostItems = () => {
  const lostItems = [
    {
      title: "Black Wallet",
      description: "Lost near the cafeteria on 10 April.",
      image: "https://i.pinimg.com/736x/75/53/d7/7553d73e59517c4d98c1011681762f73.jpg",
      location: "Cafeteria",
      date: "2025-04-10",
      reporter: "Ali Khan"
    },
    {
      title: "Red Umbrella",
      description: "Lost in Lecture Hall 2 on 8 April.",
      image: "https://i.pinimg.com/736x/c6/ce/51/c6ce511b028c7ef0c15335a3f7e69158.jpg",
      location: "Lecture Hall 2",
      date: "2025-04-08",
      reporter: "Fatima Noor"
    },
    {
      title: "Keys Keychain",
      description: "Lost outside the admin block on 11 April.",
      image: "https://i.pinimg.com/736x/ae/10/39/ae1039f55debb8913dd732c42412517f.jpg",
      location: "Admin Block",
      date: "2025-04-11",
      reporter: "Omar Rizwan"
    }
  ];

  return (
    <div className="page-container lost-items-modern">
      <div className="lost-header-modern">
        <h1>🥲 Lost Items</h1>
        <p>Browse all lost items reported in the university. Hoping someone finds them!</p>
      </div>
      <div className="lost-grid">
        {lostItems.map((item, index) => (
          <Card key={index} type="lost" {...item} />
        ))}
      </div>
    </div>
  );
};

export default LostItems;
