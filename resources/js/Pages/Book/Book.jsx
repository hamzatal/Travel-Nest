import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Calendar,
    Users,
    MessageSquare,
    ChevronLeft,
    MapPin,
} from "lucide-react";
import axios from "axios";
import Navbar from "../../Components/Nav";
import Footer from "../../Components/Footer";

export default function Book({ auth }) {
    const { props } = usePage();
    const { destination } = props; // Assuming destination is passed via props
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [formData, setFormData] = useState({
        checkIn: "",
        checkOut: "",
        guests: 1,
        notes: "",
    });
    const [totalNights, setTotalNights] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    // Calculate total nights
    useEffect(() => {
        if (formData.checkIn && formData.checkOut) {
            const checkInDate = new Date(formData.checkIn);
            const checkOutDate = new Date(formData.checkOut);
            const nights = Math.round(
                (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
            );
            setTotalNights(nights > 0 ? nights : 0);
        } else {
            setTotalNights(0);
        }
    }, [formData.checkIn, formData.checkOut]);

    // Calculate prices
    const serviceFee = 25;
    const bookingFee = 15;
    const basePrice = parseFloat(
        destination?.discount_price || destination?.price || 0
    );
    const subtotal = basePrice * totalNights;
    const totalPrice = subtotal + serviceFee + bookingFee;

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.checkIn || !formData.checkOut || totalNights <= 0) {
            setError("Please select valid check-in and check-out dates.");
            return;
        }
        if (formData.guests < 1) {
            setError("Please select at least one guest.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post("/book", {
                destination_id: destination?.id,
                check_in: formData.checkIn,
                check_out: formData.checkOut,
                guests: formData.guests,
                notes: formData.notes,
                total_price: totalPrice,
            });
            setSuccess("Booking confirmed successfully!");
            setFormData({ checkIn: "", checkOut: "", guests: 1, notes: "" });
            setTotalNights(0);
        } catch (err) {
            setError("Failed to confirm booking. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat z-0"
                style={{ backgroundImage: "url('/images/world.svg')" }}
            />
            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black opacity-30 z-0" />

            {/* Page Content */}
            <div className="relative z-10 min-h-screen text-white">
                <Head
                    title={`Book ${
                        destination?.name || "Destination"
                    } - Travel Nest`}
                />

                <Navbar
                    user={auth?.user}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                />

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
                    {/* Breadcrumb */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="mb-8"
                    >
                        <Link
                            href={`/destinations/${destination?.id}`}
                            className="flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300"
                        >
                            <ChevronLeft size={16} className="mr-1" />
                            Back to {destination?.name || "Destination"}
                        </Link>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        variants={fadeIn}
                        className="bg-gray-800 bg-opacity-70 rounded-xl p-6 md:p-8 shadow-xl backdrop-blur-sm border border-gray-700"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Book Your Stay at{" "}
                            <span className="text-blue-400">
                                {destination?.name}
                            </span>
                        </h1>
                        <p className="text-gray-300 mb-6">
                            <MapPin
                                className="inline-block mr-2 mb-1"
                                size={18}
                            />
                            {destination?.location || "Unknown Location"}
                        </p>

                        {error && (
                            <div className="bg-red-600 bg-opacity-20 text-red-400 p-4 rounded-lg mb-6">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-600 bg-opacity-20 text-green-400 p-4 rounded-lg mb-6">
                                {success}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Booking Form */}
                            <div className="lg:col-span-2">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Check-In Date */}
                                        <div>
                                            <label className="flex items-center text-gray-300 mb-2">
                                                <Calendar
                                                    className="mr-2"
                                                    size={18}
                                                />
                                                Check-In Date
                                            </label>
                                            <input
                                                type="date"
                                                name="checkIn"
                                                value={formData.checkIn}
                                                onChange={handleInputChange}
                                                className="w-full p-3 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                                min={
                                                    new Date()
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                            />
                                        </div>

                                        {/* Check-Out Date */}
                                        <div>
                                            <label className="flex items-center text-gray-300 mb-2">
                                                <Calendar
                                                    className="mr-2"
                                                    size={18}
                                                />
                                                Check-Out Date
                                            </label>
                                            <input
                                                type="date"
                                                name="checkOut"
                                                value={formData.checkOut}
                                                onChange={handleInputChange}
                                                className="w-full p-3 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                                min={
                                                    formData.checkIn ||
                                                    new Date()
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Number of Guests */}
                                    <div>
                                        <label className="flex items-center text-gray-300 mb-2">
                                            <Users className="mr-2" size={18} />
                                            Number of Guests
                                        </label>
                                        <select
                                            name="guests"
                                            value={formData.guests}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            {[...Array(8).keys()].map((i) => (
                                                <option
                                                    key={i + 1}
                                                    value={i + 1}
                                                >
                                                    {i + 1} Guest
                                                    {i + 1 > 1 ? "s" : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Additional Notes */}
                                    <div>
                                        <label className="flex items-center text-gray-300 mb-2">
                                            <MessageSquare
                                                className="mr-2"
                                                size={18}
                                            />
                                            Additional Notes (Optional)
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                            rows={4}
                                            placeholder="Any special requests or notes..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                                            isSubmitting
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {isSubmitting
                                            ? "Submitting..."
                                            : "Confirm Booking"}
                                    </button>
                                </form>
                            </div>

                            {/* Booking Summary */}
                            <div className="bg-gray-900 bg-opacity-50 rounded-xl p-6 sticky top-24">
                                <h2 className="text-xl font-semibold mb-4">
                                    Booking Summary
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Destination
                                        </span>
                                        <span>
                                            {destination?.name || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Price per Night
                                        </span>
                                        <span>${basePrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Nights
                                        </span>
                                        <span>{totalNights}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Subtotal
                                        </span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Service Fee
                                        </span>
                                        <span>${serviceFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Booking Fee
                                        </span>
                                        <span>${bookingFee.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-700 pt-3 flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <Footer />
            </div>
        </div>
    );
}
