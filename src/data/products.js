

const productData = {
  photocards: {
    title: "Photo Cards",
    items: [
      {
        id: "photocard-3d",
        name: "3D Design",
        size: "2.1\" x 3.4\"",
        color: "red",
        options: [
          {
            quantity: "9 cards",
            price: "₱85.00"
          },
          {
            quantity: "18 cards",
            price: "₱150.00"
          },
          {
            quantity: "9 cards (Back to back)",
            price: "₱140.00"
          },
          {
            quantity: "18 cards (Back to back)",
            price: "₱250.00"
          } 
        ]
      },
      {
        id: "photocard-glittered",
        name: "Glittered Finish",
        size: "2.1\" x 3.4\"",
        color: "green",
        options: [
          {
            quantity: "9 cards",
            price: "₱80.00"
          },
          {
            quantity: "18 cards",
            price: "₱130.00"
          },
          {
            quantity: "9 cards (Back to back)",
            price: "₱140.00"
          },
          {
            quantity: "18 cards (Back to back)",
            price: "₱240.00"
          }
        ]
      },
      {
        id: "photocard-matte-glossy",
        name: "Matte or Glossy Finish",
        size: "2.1\" x 3.4\"",
        color: "violet",
        options: [
          {
            quantity: "9 cards",
            price: "₱70.00"
          },
          {
            quantity: "18 cards",
            price: "₱120.00"
          },
          {
            quantity: "9 cards (Back to back)",
            price: "₱130.00"
          },
          {
            quantity: "18 cards (Back to back)",
            price: "₱230.00"
          }
        ]
      }
    ]
  },
  instaxInspired: {
    title: "Instax Inspired",
    items: [
      {
        id: "instax-mini",
        name: "MINI",
        size: "1.2\" x 3.5\"",
        color: "yellow",
        options: [
          {
            type: "Classic White",
            quantity: "10 pcs",
            price: "₱50.00"
          },
          {
            type: "Classic White",
            quantity: "30 pcs",
            price: "₱120.00"
          },
          {
            type: "Classic Colored",
            quantity: "10 pcs",
            price: "₱60.00"
          },
          {
            type: "Classic Colored",
            quantity: "30 pcs",
            price: "₱120.00"
          },
          {
            type: "Instax Design",
            quantity: "10 pcs",
            price: "₱70.00"
          },
          {
            type: "Instax Design",
            quantity: "30 pcs",
            price: "₱150.00"
          }
        ]
      },
      {
        id: "instax-square",
        name: "SQUARE",
        size: "2.8\" x 3.4\"",
        options: [
          {
            type: "Classic White",
            quantity: "8 pcs",
            price: "₱60.00"
          },
          {
            type: "Classic White",
            quantity: "24 pcs",
            price: "₱120.00"
          },
          {
            type: "Classic Colored",
            quantity: "8 pcs",
            price: "₱70.00"
          },
          {
            type: "Classic Colored",
            quantity: "24 pcs",
            price: "₱140.00"
          },
          {
            type: "Instax Design",
            quantity: "8 pcs",
            price: "₱80.00"
          },
          {
            type: "Instax Design",
            quantity: "24 pcs",
            price: "₱160.00"
          }
        ]
      },
      {
        id: "instax-wide",
        name: "WIDE",
        size: "4.25\" x 3.4\"",
        options: [
          {
            type: "Classic White",
            quantity: "5 pcs",
            price: "₱60.00"
          },
          {
            type: "Classic White",
            quantity: "15 pcs",
            price: "₱120.00"
          },
          {
            type: "Classic Colored",
            quantity: "5 pcs",
            price: "₱70.00"
          },
          {
            type: "Classic Colored",
            quantity: "15 pcs",
            price: "₱140.00"
          },
          {
            type: "Instax Design",
            quantity: "5 pcs",
            price: "₱80.00"
          },
          {
            type: "Instax Design",
            quantity: "15 pcs",
            price: "₱160.00"
          }
        ]
      },
    ]
  },
  photoStrips: {
    title: "Photo Strips",
    items: [
      {
        id: "strips-classic",
        name: "Classic Strips",
        size: "2\" x 6\"",
        options: [
          {
            type: "Classic Colors",
            quantity: "2 pcs",
            price: "₱30.00"
          },
          {
            type: "Classic Colors",
            quantity: "5 pcs",
            price: "₱50.00"
          },
          {
            type: "with Design",
            quantity: "2 pcs",
            price: "₱40.00"
          },
          {
            type: "with Design",
            quantity: "5 pcs",
            price: "₱60.00"
          }
        ]
      },
      {
        id: "strips-mini",
        name: "Classic Mini",
        size: "1.2\" x 3.5\"",
        options: [
          {
            type: "Classic",
            quantity: "4 pcs",
            price: "₱30.00"
          },
          {
            type: "Classic",
            quantity: "8 pcs",
            price: "₱50.00"
          },
          {
            type: "with Design",
            quantity: "4 pcs",
            price: "₱40.00"
          },
          {
            type: "with Design",
            quantity: "10 pcs",
            price: "₱70.00"
          }
        ]
      }
    ]
  },
  
};

export default productData;