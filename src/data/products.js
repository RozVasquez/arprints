const productData = {
  photocards: {
    title: "Photo Cards",
    items: [
      {
        id: "photocard-glittered",
        name: "Glittered Finish",
        description: "Photo cards with a beautiful glittered finish for extra sparkle. (2.2 in x 3.5 in)",
        color: "green",
        options: [
          {
            quantity: "18 pcs",
            price: "₱120",
            details: "18 cards with glitter finish"
          },
          {
            quantity: "9 pcs",
            price: "₱70",
            details: "9 cards with glitter finish"
          }
        ]
      },
      {
        id: "photocard-matte-glossy",
        name: "Matte or Glossy Finish",
        description: "Standard photo cards with your choice of matte or glossy finish. (2.2 in x 3.5 in)",
        color: "violet",
        options: [
          {
            quantity: "18 pcs",
            price: "₱100",
            details: "18 cards with choice of finish."
          },
          {
            quantity: "9 pcs",
            price: "₱60",
            details: "9 cards with choice of finish."
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
        name:"Classic",
        description: "Classic Plain Strips. (2 in x 6 in)",
        color: "blue",
        options: [
          {
            quantity: "2 strips",
            price: "₱30",
            details: "Minimalist Photo Strips. Choose any color."
          },
          {
            quantity: "5 strips",
            price: "₱50",
            details: "Minimalist Photo Strips. Choose any color."
          }
        ]
      },
      {
        id: "strips-premium",
        name: "with Design",
        description: "Creative designs just for you. (2 in x 6 in)",
        color: "green",
        options: [
          {
            quantity: "2 strips",
            price: "₱40",
            details: "Choose any design."
          },
          {
            quantity: "5 strips",
            price: "₱60",
            details: "Choose any design."
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
        name: "Classic Instax Prints",
        description: "Standard Instax-style prints with clean, classic design.",
        color: "orange",
        options: [
          {
            type: "Mini",
            quantity: "10 pcs",
            price: "₱50",
            details: "Small size, perfect for wallets and small albums. (2.1 in x 3.4 in)"
          },
          {
            type: "Square",
            quantity: "8 pcs",
            price: "₱60",
            details: "Classic square format, perfect for display. (2.8 in x 3.4 in)"
          },
          {
            type: "Wide",
            quantity: "4 pcs",
            price: "₱70",
            details: "Larger format with more detail. (4.25 in x 3.4 in)"
          }
        ]
      },
      {
        id: "instax-design",
        name: "Instax Prints with Design",
        description: "Instax-style prints with custom designs and decorative elements.",
        color: "yellow",
        options: [
          {
            type: "Mini",
            quantity: "10 pcs",
            price: "₱70",
            details: "Small size with custom design elements. (2.1 in x 3.4 in)"
          },
          {
            type: "Square",
            quantity: "8 pcs",
            price: "₱80",
            details: "Square format with custom design elements. (2.8 in x 3.4 in)"
          },
          {
            type: "Wide",
            quantity: "5 pcs",
            price: "₱100",
            details: "Larger format with custom design elements. (4.25 in x 3.4 in)"
          }
        ]
      }
    ]
  },
  "documents": {
  "title": "Documents",
  "items": [
    {
      "id": "photocopy",
      "name": "Photocopy & Print (Front)",
      "description": "High-quality photocopy and print services for your documents. (Front only)",
      "color": "gray",
      "options": [
        {
          "type": "any size",
          "quantity": "per page",
          "price": "₱3",
          "details": "Black and White photocopy on any size paper."
        },
        {
          "type": "any size",
          "quantity": "per page",
          "price": "₱4",
          "details": "Colored photocopy on any size paper."
        }
      ]
    },
    {
      "id": "print",
      "name": "Photocopy & Print (Front & Back)",
      "description": "High-quality photocopy and print services for your documents. (Front & Back)",
      "color": "blue",
      "options": [
        {
          "type": "any size",
          "quantity": "per page",
          "price": "₱4",
          "details": "Black and White print on any size paper."
        },
        {
          "type": "any size",
          "quantity": "per page",
          "price": "₱5",
          "details": "Colored print on any size paper."
        }
      ]
    }
  ]
},
"photoPrinting": {
  "title": "Photo Printing",
  "items": [
    {
      "id": "id-pictures",
      "name": "ID Pictures",
      "description": "Various ID picture packages suitable for official documents.",
      "color": "green",
      "options": [
        {
          "type": "Package 1",
          "quantity": "1x1: 6 pcs, 2x2: 4 pcs",
          "price": "₱60",
          "details": "Standard package for general ID requirements."
        },
        {
          "type": "Package 2",
          "quantity": "1x1: 4 pcs, 2x2: 6 pcs",
          "price": "₱60",
          "details": "Alternative package with more 2x2 photos."
        },
        {
          "type": "Package 3",
          "quantity": "1x1: 12 pcs",
          "price": "₱60",
          "details": "Bulk 1x1 photos for multiple uses."
        },
        {
          "type": "Package 4",
          "quantity": "2x2: 8 pcs",
          "price": "₱60",
          "details": "Bulk 2x2 photos for various applications."
        },
        {
          "type": "Package 5",
          "quantity": "Passport: 6 pcs",
          "price": "₱80",
          "details": "Standard passport-sized photos."
        },
        {
          "type": "Package 6",
          "quantity": "Passport with Name: 8 pcs",
          "price": "₱100",
          "details": "Passport-sized photos with printed name."
        }
      ]
    },
    {
      "id": "a4-photo",
      "name": "A4 Photo",
      "description": "High-quality A4 size photo prints.",
      "color": "purple",
      "options": [
        {
          "type": "Basic",
          "quantity": "1 pc",
          "price": "₱60",
          "details": "Printed on satin paper."
        },
        {
          "type": "Premium",
          "quantity": "1 pc",
          "price": "₱75",
          "details": "Printed on satin paper with matte or glossy photo top."
        }
      ]
    }
  ]
}


};

export default productData;