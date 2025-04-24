import React from "react";
import Card from "../components/Card";

const FoundItems = () => {
  const foundItems = [
    {
      title: "Blue Backpack",
      description: "Found near the main gate on 12 April.",
      image: "https://i.pinimg.com/736x/75/53/d7/7553d73e59517c4d98c1011681762f73.jpg",
      location: "Main Gate",
      date: "2025-04-12",
      reporter: "Sara Ahmed"
    },
    {
      title: "Silver Watch",
      description: "Found in the Library on 9 April.",
      image: "https://i.pinimg.com/736x/c6/ce/51/c6ce511b028c7ef0c15335a3f7e69158.jpg",
      location: "Library",
      date: "2025-04-09",
      reporter: "Kashan Ali"
    },
    {
      title: "Pen Drive",
      description: "Found in Lecture Hall 3 after class on 11 April.",
      image: "https://i.pinimg.com/736x/ae/10/39/ae1039f55debb8913dd732c42412517f.jpg",
      location: "Lecture Hall 3",
      date: "2025-04-11",
      reporter: "Ayesha Zafar"
    }
  ];

  return (
    <div className="page-container found-items-modern">
      <div className="found-header-modern">
        <h1>🔍 Found Items</h1>
        <p>Track all found items reported in the university. If you've found something, check here.</p>
      </div>
      <div className="found-grid">
        {foundItems.map((item, index) => (
          <Card key={index} type="found" {...item} />
        ))}
      </div>
    </div>
  );
};

export default FoundItems;
