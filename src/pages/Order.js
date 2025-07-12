import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import productData from '../data/products';

function Order() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    contactNo: '',
    orderDetails: '',
    orderType: '',
    designChoice: '',
    quantity: ''
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Personal Info' },
    { id: 2, title: 'Order Details' },
    { id: 3, title: 'Payment' }
  ];

  // Helper function to extract product types from products.js
  const getProductTypes = (orderDetails) => {
    const categoryMap = {
      'Photo Cards': 'photocards',
      'Instax Inspired': 'instaxInspired',
      'Strips': 'photoStrips'
    };
    
    const categoryKey = categoryMap[orderDetails];
    if (!categoryKey || !productData[categoryKey]) return [];
    
    const items = productData[categoryKey].items;
    
    if (orderDetails === 'Photo Cards') {
      return items.map(item => {
        if (item.name === 'Glittered Finish') return 'Glittered';
        if (item.name === 'Matte / Glossy Finish') return ['Matte', 'Glossy'];
        return item.name;
      }).flat();
    }
    
    if (orderDetails === 'Instax Inspired') {
      return items.map(item => {
        if (item.name === 'MINI') return 'Instax Mini';
        if (item.name === 'SQUARE') return 'Instax Square';
        if (item.name === 'WIDE') return 'Instax Wide';
        return item.name;
      });
    }
    
    if (orderDetails === 'Strips') {
      return items.map(item => {
        if (item.name === 'Classic Strips') return 'Classic';
        if (item.name === 'Classic Mini') return 'Mini';
        return item.name;
      });
    }
    
    return [];
  };

  // Helper function to extract quantity options from products.js
  const getQuantityOptions = (orderDetails, orderType) => {
    const categoryMap = {
      'Photo Cards': 'photocards',
      'Instax Inspired': 'instaxInspired',
      'Strips': 'photoStrips'
    };
    
    const categoryKey = categoryMap[orderDetails];
    if (!categoryKey || !productData[categoryKey]) return [];
    
    const items = productData[categoryKey].items;
    
    if (orderDetails === 'Photo Cards') {
      const item = items.find(item => {
        if (orderType === 'Glittered') return item.name === 'Glittered Finish';
        if (orderType === 'Matte' || orderType === 'Glossy') return item.name === 'Matte / Glossy Finish';
        return false;
      });
      
      if (item) {
        return item.options.map(option => ({
          value: option.quantity.split(' ')[0],
          label: option.quantity
        }));
      }
    }
    
    if (orderDetails === 'Instax Inspired') {
      const itemNameMap = {
        'Instax Mini': 'MINI',
        'Instax Square': 'SQUARE',
        'Instax Wide': 'WIDE'
      };
      
      const item = items.find(item => item.name === itemNameMap[orderType]);
      if (item) {
        // Get unique quantities from all options
        const quantities = [...new Set(item.options.map(option => option.quantity))];
        return quantities.map(quantity => ({
          value: quantity.split(' ')[0],
          label: quantity
        }));
      }
    }
    
    if (orderDetails === 'Strips') {
      const itemNameMap = {
        'Classic': 'Classic Strips',
        'Mini': 'Classic Mini'
      };
      
      const item = items.find(item => item.name === itemNameMap[orderType]);
      if (item) {
        // Get unique quantities from all options
        const quantities = [...new Set(item.options.map(option => option.quantity))];
        return quantities.map(quantity => ({
          value: quantity.split(' ')[0],
          label: quantity
        }));
      }
    }
    
    return [];
  };

  // Helper function to calculate price from products.js
  const calculatePriceFromData = (orderDetails, orderType, designChoice, quantity) => {
    const categoryMap = {
      'Photo Cards': 'photocards',
      'Instax Inspired': 'instaxInspired',
      'Strips': 'photoStrips'
    };
    
    const categoryKey = categoryMap[orderDetails];
    if (!categoryKey || !productData[categoryKey]) return 0;
    
    const items = productData[categoryKey].items;
    
    if (orderDetails === 'Photo Cards') {
      const item = items.find(item => {
        if (orderType === 'Glittered') return item.name === 'Glittered Finish';
        if (orderType === 'Matte' || orderType === 'Glossy') return item.name === 'Matte / Glossy Finish';
        return false;
      });
      
      if (item) {
        const option = item.options.find(opt => opt.quantity === `${quantity} cards`);
        if (option) {
          return parseInt(option.price.replace('₱', '').replace('.00', ''));
        }
      }
    }
    
    if (orderDetails === 'Instax Inspired') {
      const itemNameMap = {
        'Instax Mini': 'MINI',
        'Instax Square': 'SQUARE',
        'Instax Wide': 'WIDE'
      };
      
      const item = items.find(item => item.name === itemNameMap[orderType]);
      if (item) {
        const targetQuantity = `${quantity} pcs`;
                 const typeMapping = {
           'Plain': ['Classic White'],
           'Colored': ['Classic Colored'],
           'Designed': ['Instax Design']
         };
        
        const targetTypes = typeMapping[designChoice] || [];
        
        const option = item.options.find(opt => 
          opt.quantity === targetQuantity && 
          targetTypes.some(type => opt.type === type)
        );
        
        if (option) {
          return parseInt(option.price.replace('₱', '').replace('.00', ''));
        }
      }
    }
    
    if (orderDetails === 'Strips') {
      const itemNameMap = {
        'Classic': 'Classic Strips',
        'Mini': 'Classic Mini'
      };
      
      const item = items.find(item => item.name === itemNameMap[orderType]);
      if (item) {
        const targetQuantity = `${quantity} pcs`;
        const typeMapping = {
          'Plain': ['Classic Colors', 'Classic'],
          'Designed': ['with Design']
        };
        
        const targetTypes = typeMapping[designChoice] || [];
        
        const option = item.options.find(opt => 
          opt.quantity === targetQuantity && 
          targetTypes.some(type => opt.type === type)
        );
        
        if (option) {
          return parseInt(option.price.replace('₱', '').replace('.00', ''));
        }
      }
    }
    
    return 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset orderType and quantity when orderDetails changes
      ...(name === 'orderDetails' && { 
        orderType: '', 
        quantity: '',
        // Clear design choice for Photo Cards
        ...(value === 'Photo Cards' && { designChoice: '' }),
        // Clear design choice when switching away from Instax Inspired if Colored is selected
        ...(prev.orderDetails === 'Instax Inspired' && value !== 'Instax Inspired' && prev.designChoice === 'Colored' && { designChoice: '' })
      }),
      // Reset quantity when orderType changes (for Instax Inspired and Strips)
      ...(name === 'orderType' && { quantity: '' })
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateTotal = () => {
    const { orderDetails, orderType, quantity, designChoice } = formData;
    if (!orderDetails || !orderType || !quantity) return 0;
    
    // For Photo Cards, design choice doesn't affect pricing
    if (orderDetails === 'Photo Cards') {
      return calculatePriceFromData(orderDetails, orderType, designChoice, quantity);
    }
    
    // For Instax Inspired and Strips, design choice affects pricing
    if (!designChoice) return 0;
    return calculatePriceFromData(orderDetails, orderType, designChoice, quantity);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.contactNo.trim()) newErrors.contactNo = 'Contact number is required';
    } else if (step === 2) {
      if (!formData.orderDetails) newErrors.orderDetails = 'Please select order details';
      if (!formData.orderType) newErrors.orderType = 'Please select order type';
      if (formData.orderDetails !== 'Photo Cards' && !formData.designChoice) newErrors.designChoice = 'Please select design choice';
      if (!formData.quantity) newErrors.quantity = 'Please select quantity';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleDesignChoice = (choice) => {
    setFormData(prev => ({ ...prev, designChoice: choice }));
    if (errors.designChoice) {
      setErrors(prev => ({ ...prev, designChoice: '' }));
    }
  };



  const handleSubmit = () => {
    // Validate all required fields before submission
    const allErrors = {};
    if (!formData.name.trim()) allErrors.name = 'Name is required';
    if (!formData.contactNo.trim()) allErrors.contactNo = 'Contact number is required';
    if (!formData.orderDetails) allErrors.orderDetails = 'Please select order details';
    if (!formData.orderType) allErrors.orderType = 'Please select order type';
    if (formData.orderDetails !== 'Photo Cards' && !formData.designChoice) allErrors.designChoice = 'Please select design choice';
    if (!formData.quantity) allErrors.quantity = 'Please select quantity';

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    // Calculate total using pricing data
    const total = calculateTotal();
    const downPayment = total * 0.5;

    // Format for Gmail
    const emailSubject = `Order Request - ${formData.name}`;
    const emailBody = `Hello AR Prints,

I would like to place an order with the following details:

Order Information:
- Name: ${formData.name}
- Contact Number: ${formData.contactNo}
- Product: ${formData.orderDetails}
- Type: ${formData.orderType}${formData.orderDetails !== 'Photo Cards' ? `\n- Design: ${formData.designChoice}` : ''}
- Quantity: ${formData.quantity} piece(s)

Total Amount: ₱${total.toLocaleString()}
50% Down Payment: ₱${downPayment.toLocaleString()}

Instructions:
1. Upload the payment receipt.
2. Upload the chosen designs.
3. Upload the images.
4. Provide notes/instructions about the order.
5. If you have any questions you can message us directly at https://www.facebook.com/arprintservices/

Thank you
`;

    // Create Gmail link
    const gmailLink = `https://mail.google.com/mail/?view=cm&to=arprintsservices@gmail.com&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open Gmail
    window.open(gmailLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-2xl mx-auto px-3 md:px-4">
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Place Your Order</h1>
          <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
            By filling up the form, you already have a screenshot of your chosen design. You will be required to upload the designs later in Gmail.
          </p>

          {/* Progress Bar */}
          <div className="mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <span className="text-xs md:text-sm font-medium text-gray-600">Step {currentStep} of {steps.length}</span>
              <span className="text-xs md:text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Stepper */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > step.id ? <Check className="w-3 h-3 sm:w-5 sm:h-5" /> : step.id}
                    </div>
                    <div className="mt-1 sm:mt-2 text-center">
                      <p className={`text-xs sm:text-sm font-medium ${
                        currentStep >= step.id ? 'text-pink-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 sm:w-20 h-px mx-2 sm:mx-4 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <>
                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Name *"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <input
                    type="tel"
                    id="contactNo"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      errors.contactNo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Contact Number *"
                  />
                  {errors.contactNo && <p className="text-red-500 text-sm mt-1">{errors.contactNo}</p>}
                </div>
              </>
            )}

            {/* Step 2: Order Details */}
            {currentStep === 2 && (
              <>
                <div>
                  <div className="relative">
                    <select
                      id="orderDetails"
                      name="orderDetails"
                      value={formData.orderDetails}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white ${
                        errors.orderDetails ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Order Details *</option>
                      <option value="Photo Cards">Photo Cards</option>
                      <option value="Instax Inspired">Instax Inspired</option>
                      <option value="Strips">Strips</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                  {errors.orderDetails && <p className="text-red-500 text-sm mt-1">{errors.orderDetails}</p>}
                </div>

                {formData.orderDetails && (
                  <div>
                    <div className="relative">
                      <select
                        id="orderType"
                        name="orderType"
                        value={formData.orderType}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white ${
                          errors.orderType ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Order Type *</option>
                        {getProductTypes(formData.orderDetails)?.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                    {errors.orderType && <p className="text-red-500 text-sm mt-1">{errors.orderType}</p>}
                  </div>
                )}

                {formData.orderDetails !== 'Photo Cards' && (
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">Design Choice *</p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleDesignChoice('Plain')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.designChoice === 'Plain'
                            ? 'bg-pink-500 border-pink-500 text-white'
                            : 'border-pink-200 text-pink-600 hover:border-pink-300'
                        }`}
                      >
                        Plain
                      </button>
                      {formData.orderDetails === 'Instax Inspired' && (
                        <button
                          type="button"
                          onClick={() => handleDesignChoice('Colored')}
                          className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                            formData.designChoice === 'Colored'
                              ? 'bg-pink-500 border-pink-500 text-white'
                              : 'border-pink-200 text-pink-600 hover:border-pink-300'
                          }`}
                        >
                          Colored
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDesignChoice('Designed')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.designChoice === 'Designed'
                            ? 'bg-pink-500 border-pink-500 text-white'
                            : 'border-pink-200 text-pink-600 hover:border-pink-300'
                        }`}
                      >
                        Designed
                      </button>
                    </div>
                    {errors.designChoice && <p className="text-red-500 text-sm mt-1">{errors.designChoice}</p>}
                  </div>
                )}

                {formData.orderDetails && (
                  <div>
                    <div className="relative">
                      <select
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white ${
                          errors.quantity ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Quantity *</option>
                        {formData.orderDetails && formData.orderType && 
                         getQuantityOptions(formData.orderDetails, formData.orderType)?.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                    {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                  </div>
                )}
              </>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <>
                {/* Order Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Order Details:</span>
                      <span className="font-medium">{formData.orderDetails}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{formData.orderType}</span>
                    </div>
                    {formData.orderDetails !== 'Photo Cards' && (
                      <div className="flex justify-between">
                        <span>Design:</span>
                        <span className="font-medium">{formData.designChoice}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-medium">
                        {formData.orderDetails && formData.orderType && 
                         getQuantityOptions(formData.orderDetails, formData.orderType)?.find(opt => opt.value === formData.quantity)?.label}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total:</span>
                        <span>₱{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-white border-2 border-pink-200 rounded-lg p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-pink-800 mb-4 md:mb-6 text-left">Payment Instructions</h3>
                  <div className="space-y-4 text-gray-700 text-left">
                    <div className="space-y-3">
                      <p className="font-medium text-left">1. There will be a 50% down payment of your order.</p>
                      <p className="font-medium text-left">2. Send the payment via GCASH.</p>
                      <p className="font-medium text-left">3. Download the receipt from GCASH.</p>
                      <p className="font-medium text-left">4. Upload the receipt and chosen design images in Gmail.</p>
                    </div>
                    
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 md:p-4 mt-4 md:mt-6">
                      <h4 className="text-sm md:text-base font-bold text-pink-800 mb-2 text-left">GCASH Details</h4>
                      <p className="text-left"><strong>Name:</strong> Roz Vasquez</p>
                      <p className="text-left"><strong>Number:</strong> 09606592742</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Submit Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order; 