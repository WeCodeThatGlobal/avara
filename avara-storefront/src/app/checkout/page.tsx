"use client";
import React, { useState, ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useCart } from "../../lib/context/CartContext"; 
import Link from 'next/link';
import {
    HiOutlineArrowLeft,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlineEnvelope,
    HiOutlineHome,
    HiOutlineCreditCard,
    HiOutlineCalendar,
    HiOutlineQuestionMarkCircle
} from 'react-icons/hi2';
import { CartItem } from 'types/global';
import InputField from '../../common/components/input/InputField';


const CheckoutPage = () => {
    const { state: cartState } = useCart();
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash'); // cash or card

    type FormData = {
        [key: string]: string;
    };

    // State for form data
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        country: 'United States',
        postCode: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
    });

    type FormErrors = {
        [key: string]: string;
    };

    const [errors, setErrors] = useState<FormErrors>({});

    const formatPrice = (price: number) => {
        const numericPrice = Number(price);
        if (isNaN(numericPrice)) return '$0.00';
        return `$${numericPrice.toFixed(2)}`;
    };

    const shippingCost = 0.00;
    const subtotal = cartState.totalPrice || 0;
    const total = subtotal + shippingCost;

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'firstName':
                if (!value) error = 'First name is required.';
                break;
            case 'lastName':
                if (!value) error = 'Last name is required.';
                break;
            case 'email':
                if (!value) {
                    error = 'Email is required.';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = 'Email address is invalid.';
                }
                break;
            case 'address':
                if (!value) error = 'Address is required.';
                break;
            case 'postCode':
                if (!value) error = 'Zip / Post Code is required.';
                break;
            case 'cardNumber':
                if (paymentMethod === 'card' && !value) error = 'Card number is required.';
                break;
            case 'expiryDate':
                 if (paymentMethod === 'card' && !value) error = 'Expiry date is required.';
                break;
            case 'cvc':
                 if (paymentMethod === 'card' && !value) error = 'CVC is required.';
                break;
            default:
                break;
        }
        return error;
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
         if (errors[name]) {
            const error = validateField(name, value);
            setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
        }
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form is valid, placing order:', formData);
        } else {
            console.log('Form is invalid, please check the errors.');
        }
    };


    if (!cartState || !cartState.items || cartState.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
                    <p className="text-gray-600 mb-6">Add items to your cart to proceed to checkout.</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm">
                        <HiOutlineArrowLeft className="w-5 h-5" />
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Checkout Summary</h1>
                </div>

                <form onSubmit={handlePlaceOrder} noValidate className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* LEFT COLUMN: FORMS */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-semibold">Returning Customer? <Link href="/login" className="text-blue-600 hover:underline text-base font-medium">Click here to login</Link></h2>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-semibold mb-5">Billing Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField id="firstName" label="First Name" Icon={HiOutlineUser} required value={formData.firstName} onChange={handleChange} onBlur={handleBlur} error={errors.firstName} />
                                <InputField id="lastName" label="Last Name" Icon={HiOutlineUser} required value={formData.lastName} onChange={handleChange} onBlur={handleBlur} error={errors.lastName} />
                                <div className="md:col-span-2">
                                    <InputField id="email" label="Email Address" type="email" Icon={HiOutlineEnvelope} required value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
                                </div>
                                <div className="md:col-span-2">
                                    <InputField id="address" label="Address" Icon={HiOutlineHome} required value={formData.address} onChange={handleChange} onBlur={handleBlur} error={errors.address} placeholder="Address Line 1" />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-600 mb-2">Country *</label>
                                    <select id="country" name="country" value={formData.country} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                    </select>
                                </div>
                                <InputField id="postCode" label="Zip / Post Code" required value={formData.postCode} onChange={handleChange} onBlur={handleBlur} error={errors.postCode} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-semibold mb-5">Payment Method</h2>
                            <div className="space-y-4">
                                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'cash' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'}`}>
                                    <input type="radio" name="payment" className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                                    <span className="ml-4 font-medium">Cash On Delivery</span>
                                </label>
                                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'card' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'}`}>
                                    <input type="radio" name="payment" className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                    <span className="ml-4 font-medium">Credit Card</span>
                                    <HiOutlineCreditCard className="w-6 h-6 ml-auto text-gray-500" />
                                </label>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="mt-6 border-t border-gray-200 pt-6 animate-fade-in">
                                    <div className="grid grid-cols-1 gap-6">
                                        <InputField id="cardNumber" label="Card Number" Icon={HiOutlineCreditCard} placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleChange} onBlur={handleBlur} error={errors.cardNumber} maxLength={19} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField id="expiryDate" label="Expiry Date" Icon={HiOutlineCalendar} placeholder="MM / YY" value={formData.expiryDate} onChange={handleChange} onBlur={handleBlur} error={errors.expiryDate} maxLength={7} />
                                            <InputField id="cvc" label="CVC / CVV" Icon={HiOutlineQuestionMarkCircle} placeholder="123" value={formData.cvc} onChange={handleChange} onBlur={handleBlur} error={errors.cvc} maxLength={4} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 sticky top-8">
                            <h2 className="text-2xl font-semibold mb-6">Your Order</h2>
                            <div className="border-b border-gray-200 pb-6 mb-6 space-y-4">
                                {cartState.items.map((item: CartItem) => (
                                    <div key={item.id} className="flex items-start gap-4">
                                        <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg p-2 border border-gray-200">
                                            <img src={item.image || 'https://placehold.co/150x150/f0f0f0/333?text=Image'} alt={item.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150/f0f0f0/333?text=Error'; }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="font-semibold text-right">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mb-6">
                                {!showCouponInput ? (
                                    <p className="text-gray-600">Have a coupon? <button type="button" onClick={() => setShowCouponInput(true)} className="text-blue-600 font-semibold hover:underline">Click here to enter your code</button></p>
                                ) : (
                                    <div className="flex gap-2 animate-fade-in">
                                        <input type="text" placeholder="Coupon code" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                                        <button type="button" className="bg-gray-800 text-white px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors">Apply</button>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4 border-t border-gray-200 pt-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium">{shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200 mt-4">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-6">Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <a href="#" className="underline">privacy policy</a>.</p>
                            <button type="submit" className="w-full mt-6 bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm flex items-center justify-center gap-2">
                                <HiOutlineLockClosed className="w-5 h-5" />
                                Place Order
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
