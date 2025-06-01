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
            price: "₱120"
          },
          {
            quantity: "9 pcs",
            price: "₱70"
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
            price: "₱100"
          },
          {
            quantity: "9 pcs",
            price: "₱60"
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
        description: "Classic Plain Strips.",
        color: "blue",
        options: [
          {
            quantity: "2 Strips (2\" x 6\")",
            price: "₱30"
          },
          {
            quantity: "5 Strips (2\" x 6\")",
            price: "₱50"
          },
          {
            quantity: "4 Mini Strips (1.2\" x 3.5\")",
            price: "₱30"
          },
          {
            quantity: "10 Mini Strips (1.2\" x 3.5\")",
            price: "₱60"
          }
        ]
      },
      {
        id: "strips-premium",
        name: "with Design",
        description: "Creative designs just for you.",
        color: "green",
        options: [
          {
            quantity: "2 Strips (2\" x 6\")",
            price: "₱40"
          },
          {
            quantity: "5 Strips (2\" x 6\")",
            price: "₱60"
          },
          {
            quantity: "4 Mini Strips (1.2\" x 3.5\")",
            price: "₱40"
          },
          {
            quantity: "10 Mini Strips (1.2\" x 3.5\")",
            price: "₱60"
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
            price: "₱50"
          },
          {
            type: "Square",
            quantity: "8 pcs",
            price: "₱60"
          },
          {
            type: "Wide",
            quantity: "4 pcs",
            price: "₱70"
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
            price: "₱70"
          },
          {
            type: "Square",
            quantity: "8 pcs",
            price: "₱80"
          },
          {
            type: "Wide",
            quantity: "5 pcs",
            price: "₱100"
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
          "type": "Black and White",
          "quantity": "per page",
          "price": "₱3"
        },
        {
          "type": "Colored",
          "quantity": "per page",
          "price": "₱4"
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
          "type": "Black and White",
          "quantity": "per page",
          "price": "₱4"
        },
        {
          "type": "Colored",
          "quantity": "per page",
          "price": "₱5"
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
          "quantity": "1x1: 8 pcs",
          "price": "₱30"
        },
        {
          "type": "Package 2",
          "quantity": "2x2: 4pcs + 1x1: 4pcs",
          "price": "₱35"
        },
        {
          "type": "Package 3",
          "quantity": "2x2: 4pcs + 1x1: 8pcs",
          "price": "₱65"
        },
        {
          "type": "Package 4",
          "quantity": "Passport: 6 pcs",
          "price": "₱40"
        },
        {
          "type": "Package 5",
          "quantity": "2x2: 4pcs + Passport: 2pcs",
          "price": "₱45"
        },
        {
          "type": "Package 6",
          "quantity": "Passport with Name: 8 pcs",
          "price": "₱65"
        }
      ]
    },
    {
      "id": "photo-prints",
      "name": "Photo Prints",
      "description": "High-quality A4 size photo prints.",
      "color": "purple",
      "options": [
        {
          "type": "3R",
          "quantity": "2 pc",
          "price": "₱45"
        },
        {
          "type": "4R",
          "quantity": "2 pc",
          "price": "₱60"
        },
        {
          "type": "5R",
          "quantity": "1 pc",
          "price": "₱40"
        },
        {
          "type": "A4",
          "quantity": "1 pc",
          "price": "₱60"
        },
        {
          "type": "A4 + Matte / Glossy Photo Top",
          "quantity": "1 pc",
          "price": "₱75"
        },
        {
          "type": "Add-Ons: Matte / Glossy Photo Top",
          "quantity": "1 pc",
          "price": "₱15"
        }
      ]
    }
  ]
}


};

export default productData;