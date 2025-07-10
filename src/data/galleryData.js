const galleryData = {
  photocard: {
    title: "Photocard Designs",
    categoryImage: "/images/designs/Covers/Cards.png",
    items: [
      { path: "/images/designs/photocards/Glitters.jpg" },
      { path: "/images/designs/photocards/Matte.jpg" },
    ]
  },
  instax: {
    title: "Instax Designs",
    categoryImage: "/images/designs/Covers/Instax.png",
    useCardLayout: true,
    subtypes: {
      plain: {
        title: "Classic",
        items: [
          { path: "/images/designs/instaxmini/Design1.jpg" },
          { path: "/images/designs/instaxmini/Design2.jpg" },
          { path: "/images/designs/instaxmini/Design3.jpg" },
          { path: "/images/designs/instaxmini/Design4.jpg" },
        ]
      },
      designed: {
        title: "Designed",
        items: [
          { path: "/images/designs/instaxmini/Design1.jpg" },
          { path: "/images/designs/instaxmini/Design2.jpg" },
          { path: "/images/designs/instaxmini/Design3.jpg" },
          { path: "/images/designs/instaxmini/Design4.jpg" },
          { path: "/images/designs/instaxmini/Design5.jpg" },
          { path: "/images/designs/instaxmini/Design6.jpg" },
          { path: "/images/designs/instaxmini/Design7.jpg" },
          { path: "/images/designs/instaxmini/Design8.jpg" },
          { path: "/images/designs/instaxmini/Design9.jpg" },
          { path: "/images/designs/instaxmini/Design10.jpg" },
          { path: "/images/designs/instaxmini/Design11.jpg" },
          { path: "/images/designs/instaxmini/Design12.jpg" },
        ]
      },
    }
  },
  strips: {
    title: "Photo Strip Designs",
    categoryImage: "/images/designs/Covers/Strips.png",
    useCardLayout: true,
    subtypes: {
      plain: {
        title: "Classic",
        items: [
          { path: "/images/designs/strips/Classic.jpg" },
          /* Insert Classic Strips Here */
        ]
      },
      designed: {
        title: "Designed",
        items: [
          { path: "/images/designs/strips/Film.jpg" },
          { path: "/images/designs/strips/Silakbo.jpg" },
          { path: "/images/designs/strips/Taylor.jpg" },
          { path: "/images/designs/strips/Creative.png" },
        ]
      },
    }
  }
};

export default galleryData; 