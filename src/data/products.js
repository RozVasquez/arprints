const productData = {
  photos: {
    title: "Photos",
    items: [
      {
        id: "photo-prints",
        name: "Photo Prints",
        description: "High-quality photo prints in various sizes",
        color: "purple",
        options: [
          {
            type: "3R",
            quantity: "2 pc",
            price: "₱45.00"
          },
          {
            type: "4R",
            quantity: "2 pc",
            price: "₱60.00"
          },
          {
            type: "5R",
            quantity: "1 pc",
            price: "₱40.00"
          },
          {
            type: "A4",
            quantity: "1 pc",
            price: "₱60.00"
          },
          {
            type: "A4 + Matte / Glossy Photo Top",
            quantity: "1 pc",
            price: "₱75.00"
          },
          {
            type: "Add-Ons: Matte / Glossy Photo Top",
            quantity: "1 pc",
            price: "₱15.00"
          }
        ]
      },
      {
        id: "rush-id",
        name: "Rush ID",
        description: "Quick and quality ID pictures for various purposes",
        color: "purple",
        options: [
          {
            type: "Package 1",
            quantity: "8 pcs 1x1",
            price: "₱30.00"
          },
          {
            type: "Package 2",
            quantity: "4 pcs 1x1 + 4 pcs 2x2",
            price: "₱35.00"
          },
          {
            type: "Package 3",
            quantity: "8 pcs 1x1 + 4 pcs 2x2",
            price: "₱65.00"
          },
          {
            type: "Package 4",
            quantity: "6 pcs Passport",
            price: "₱40.00"
          },
          {
            type: "Package 5",
            quantity: "4 pcs 2x2 + 2 pcs Passport",
            price: "₱45.00"
          },
          {
            type: "Package 6",
            quantity: "8 pcs Passport with name",
            price: "₱65.00"
          }
        ]
      }
    ]
  },
  photocards: {
    title: "Photo Cards",
    items: [
      {
        id: "photocard-glittered",
        name: "Glittered Finish",
        description: "2.1\" x 3.4\"",
        color: "green",
        options: [
          {
            quantity: "9 cards",
            price: "₱70.00"
          },
          {
            quantity: "18 cards",
            price: "₱120.00"
          }
        ]
      },
      {
        id: "photocard-matte-glossy",
        name: "Matte / Glossy Finish",
        description: "2.1\" x 3.4\"",
        color: "violet",
        options: [
          {
            quantity: "9 cards",
            price: "₱60.00"
          },
          {
            quantity: "18 cards",
            price: "₱100.00"
          }
        ]
      }
    ]
  },
  instaxInspired: {
    title: "Instax Inspired",
    items: [
      {
        id: "instax-square",
        name: "SQUARE",
        description: "2.8\" x 3.4\"",
        color: "orange",
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
        description: "4.25\" x 3.4\"",
        color: "blue",
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
      {
        id: "instax-mini",
        name: "MINI",
        description: "1.2\" x 3.5\"",
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
            price: "₱100.00"
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
      }
    ]
  },
  photoStrips: {
    title: "Photo Strips",
    items: [
      {
        id: "strips-classic",
        name: "Classic Strips",
        description: "2\" x 6\"",
        color: "blue",
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
        description: "1.2\" x 3.5\"",
        color: "green",
        options: [
          {
            type: "Classic",
            quantity: "4 pcs",
            price: "₱30.00"
          },
          {
            type: "Classic",
            quantity: "10 pcs",
            price: "₱60.00"
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
  documentPrinting: {
    title: "Document Printing",
    items: [
      {
        id: "text-only",
        name: "Text Only",
        description: "Document printing for text-only documents",
        color: "gray",
        options: [
          {
            type: "Black and White (One Side)",
            quantity: "Short Size",
            price: "₱3.00/page"
          },
          {
            type: "Black and White (One Side)",
            quantity: "A4 Size",
            price: "₱3.00/page"
          },
          {
            type: "Black and White (One Side)",
            quantity: "Long Size",
            price: "₱4.00/page"
          },
          {
            type: "Black and White (Back to back)",
            quantity: "Short Size",
            price: "₱3.00/page"
          },
          {
            type: "Black and White (Back to back)",
            quantity: "A4 Size",
            price: "₱3.00/page"
          },
          {
            type: "Black and White (Back to back)",
            quantity: "Long Size",
            price: "₱4.00/page"
          },
          {
            type: "Partially Colored",
            quantity: "Short Size",
            price: "₱4.00/page"
          },
          {
            type: "Partially Colored",
            quantity: "A4 Size",
            price: "₱4.00/page"
          },
          {
            type: "Partially Colored",
            quantity: "Long Size",
            price: "₱5.00/page"
          },
          {
            type: "Full Colored",
            quantity: "Short Size",
            price: "₱5.00/page"
          },
          {
            type: "Full Colored",
            quantity: "A4 Size",
            price: "₱5.00/page"
          },
          {
            type: "Full Colored",
            quantity: "Long Size",
            price: "₱6.00/page"
          }
        ]
      },
      {
        id: "text-with-image",
        name: "Text w/ Image",
        description: "Document printing for text with images",
        color: "blue",
        options: [
          {
            type: "Black and White",
            quantity: "Short Size",
            price: "₱5.00/page"
          },
          {
            type: "Black and White",
            quantity: "A4 Size",
            price: "₱5.00/page"
          },
          {
            type: "Black and White",
            quantity: "Long Size",
            price: "₱7.00/page"
          },
          {
            type: "Full Colored",
            quantity: "Short Size",
            price: "₱6.00/page"
          },
          {
            type: "Full Colored",
            quantity: "A4 Size",
            price: "₱6.00/page"
          },
          {
            type: "Full Colored",
            quantity: "Long Size",
            price: "₱10.00/page"
          }
        ]
      },
      {
        id: "image-only",
        name: "Image Only",
        description: "Document printing for image-only documents",
        color: "green",
        options: [
          {
            type: "Black and White",
            quantity: "Short Size",
            price: "₱5.00/page"
          },
          {
            type: "Black and White",
            quantity: "A4 Size",
            price: "₱5.00/page"
          },
          {
            type: "Black and White",
            quantity: "Long Size",
            price: "₱7.00/page"
          },
          {
            type: "Full Colored",
            quantity: "Short Size",
            price: "₱10.00/page"
          },
          {
            type: "Full Colored",
            quantity: "A4 Size",
            price: "₱10.00/page"
          },
          {
            type: "Full Colored",
            quantity: "Long Size",
            price: "₱12.00/page"
          }
        ]
      }
    ]
  }
};

export default productData;