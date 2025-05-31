const productData = {
  photocards: {
    title: "Photo Cards",
    items: [
      {
        id: "photocard-glittered",
        name: "🟢 Photo Cards – Glittered Finish",
        description: "Photo cards with a beautiful glittered finish for extra sparkle",
        color: "green",
        options: [
          {
            quantity: "18 pcs",
            price: "₱100",
            details: "Full set with premium glitter finish"
          },
          {
            quantity: "9 pcs",
            price: "₱60",
            details: "Half set with premium glitter finish"
          }
        ]
      },
      {
        id: "photocard-matte-glossy",
        name: "🟣 Photo Cards – Matte & Glossy Finish",
        description: "Standard photo cards with your choice of matte or glossy finish",
        color: "violet",
        options: [
          {
            quantity: "18 pcs",
            price: "₱90",
            details: "Full set with choice of finish"
          },
          {
            quantity: "9 pcs",
            price: "₱50",
            details: "Half set with choice of finish"
          }
        ]
      }
    ]
  },
  strips: {
    title: "Photo Strips",
    items: [
      {
        id: "strips-classic",
        name: "🔵 Photo Strips (2\" x 6\")",
        description: "Traditional photo booth style strips",
        color: "blue",
        options: [
          {
            quantity: "6 strips",
            price: "₱70",
            details: "Classic photo strips, perfect for memories"
          }
        ]
      }
    ]
  },
  instax: {
    title: "Instax Prints",
    items: [
      {
        id: "instax-classic",
        name: "🟠 Classic Instax Prints",
        description: "Standard Instax-style prints with clean, classic design",
        color: "orange",
        options: [
          {
            type: "Mini",
            quantity: "10 pcs",
            price: "₱80",
            details: "Small size, perfect for wallets and small albums"
          },
          {
            type: "Square",
            quantity: "8 pcs",
            price: "₱100",
            details: "Classic square format, perfect for display"
          },
          {
            type: "Wide",
            quantity: "6 pcs",
            price: "₱120",
            details: "Larger format with more detail"
          }
        ]
      },
      {
        id: "instax-design",
        name: "🟡 Instax Prints with Design",
        description: "Instax-style prints with custom designs and decorative elements",
        color: "yellow",
        options: [
          {
            type: "Mini",
            quantity: "10 pcs",
            price: "₱100",
            details: "Small size with custom design elements"
          },
          {
            type: "Square",
            quantity: "8 pcs",
            price: "₱120",
            details: "Square format with custom design elements"
          },
          {
            type: "Wide",
            quantity: "6 pcs",
            price: "₱140",
            details: "Larger format with custom design elements"
          }
        ]
      }
    ]
  }
};

export default productData;