import React, { useState, useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Calendar,
    Users,
    MessageSquare,
    ChevronLeft,
    MapPin,
} from "lucide-react";
import Navbar from "../../Components/Nav";
import Footer from "../../Components/Footer";
import toast, { Toaster } from "react-hot-toast";

export default function Book({ auth, destination, package: pkg, offer }) {
    const { props } = usePage();
    const { flash } = props;
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Determine the entity being booked
    const entity = destination || pkg || offer;
    const entityType = destination ? "destination" : pkg ? "package" : "offer";
    const entityId = entity?.id;
    const entityName = entity
        ? destination?.name || pkg?.title || offer?.title
        : "Unknown";
    const entityLocation = entity?.location || "Unknown Location";
    const maxGuests = offer?.max_guests || 8; // Default to 8 for destinations/packages

    // Form state using Inertia's useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        [`${entityType}_id`]: entityId,
        check_in: "",
        check_out: "",
        guests: 1,
        notes: "",
        total_price: 0,
    });

    const [totalNights, setTotalNights] = useState(0);
    const [formError, setFormError] = useState(null);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    // Calculate total nights
    useEffect(() => {
        if (data.check_in && data.check_out) {
            const checkInDate = new Date(data.check_in);
            const checkOutDate = new Date(data.check_out);
            const nights = Math.round(
                (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
            );
            setTotalNights(nights > 0 ? nights : 0);
        } else {
            setTotalNights(0);
        }
    }, [data.check_in, data.check_out]);

    // Display flash messages
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    // Calculate prices
    const serviceFee = 9.99;
    const bookingFee = 4.99;
    const basePrice = parseFloat(entity?.discount_price || entity?.price || 0);
    const subtotal = basePrice * totalNights;
    const totalPrice = subtotal + serviceFee + bookingFee;

    // Update total_price in form data
    useEffect(() => {
        setData("total_price", totalPrice);
    }, [totalPrice]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);

        // Client-side validation
        if (!data.check_in || !data.check_out || totalNights <= 0) {
            setFormError("Please select valid check-in and check-out dates.");
            return;
        }
        if (data.guests < 1 || data.guests > maxGuests) {
            setFormError(`Please select between 1 and ${maxGuests} guests.`);
            return;
        }
        if (offer) {
            const checkIn = new Date(data.check_in);
            const checkOut = new Date(data.check_out);
            const startDate = new Date(offer.start_date);
            const endDate = new Date(offer.end_date);
            if (checkIn < startDate || checkOut > endDate) {
                setFormError(
                    "Booking dates must be within the offer's valid period."
                );
                return;
            }
        }

        post(route("book.store"), {
            onSuccess: () => {
                reset();
                setTotalNights(0);
            },
        });
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, name === "guests" ? parseInt(value) : value);
    };

    // If no entity is provided
    if (!entity) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
                <p className="text-xl">No booking details available.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-all duration-300">
            <Head title={`Book ${entityName} - Travel Nest`} />
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

            <Navbar
                user={auth?.user}
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />

            <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
                {/* Breadcrumb */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="mb-8"
                >
                    <Link
                        href={
                            entityType === "offer"
                                ? `/offers/${entityId}`
                                : `/destinations/${entityId}`
                        }
                        className="flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300"
                    >
                        <ChevronLeft size={16} className="mr-1" />
                        Back to {entityName}
                    </Link>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-gray-800 bg-opacity-70 rounded-xl p-6 md:p-8 shadow-xl border border-gray-700"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Book Your Stay at{" "}
                        <span className="text-blue-400">{entityName}</span>
                    </h1>
                    <p className="text-gray-300 mb-6">
                        <MapPin className="inline-block mr-2 mb-1" size={18} />
                        {entityLocation}
                    </p>

                    {formError && (
                        <div className="bg-red-600 bg-opacity-20 text-red-400 p-4 rounded-lg mb-6">
                            {formError}
                        </div>
                    )}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-600 bg-opacity-20 text-red-400 p-4 rounded-lg mb-6">
                            {Object.values(errors)[0]}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Booking Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Check-In Date */}
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeIn}
                                    >
                                        <label className="flex items-center text-gray-300 mb-2">
                                            <Calendar
                                                className="mr-2"
                                                size={18}
                                            />
                                            Check-In Date
                                        </label>
                                        <input
                                            type="date"
                                            name="check_in"
                                            value={data.check_in}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        />
                                    </motion.div>

                                    {/* Check-Out Date */}
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeIn}
                                    >
                                        <label className="flex items-center text-gray-300 mb-2">
                                            <Calendar
                                                className="mr-2"
                                                size={18}
                                            />
                                            Check-Out Date
                                        </label>
                                        <input
                                            type="date"
                                            name="check_out"
                                            value={data.check_out}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            min={
                                                data.check_in ||
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        />
                                    </motion.div>
                                </div>

                                {/* Number of Guests */}
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeIn}
                                >
                                    <label className="flex items-center text-gray-300 mb-2">
                                        <Users className="mr-2" size={18} />
                                        Number of Guests
                                    </label>
                                    <select
                                        name="guests"
                                        value={data.guests}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        {[...Array(maxGuests).keys()].map(
                                            (i) => (
                                                <option
                                                    key={i + 1}
                                                    value={i + 1}
                                                >
                                                    {i + 1} Guest
                                                    {i + 1 > 1 ? "s" : ""}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </motion.div>

                                {/* Additional Notes */}
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeIn}
                                >
                                    <label className="flex items-center text-gray-300 mb-2">
                                        <MessageSquare
                                            className="mr-2"
                                            size={18}
                                        />
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={data.notes}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                        rows={4}
                                        placeholder="Any special requests or notes..."
                                    />
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                                        processing
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeIn}
                                >
                                    {processing
                                        ? "Submitting..."
                                        : "Confirm Booking"}
                                </motion.button>
                            </form>
                        </div>

                        {/* Booking Summary */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="bg-gray-900 bg-opacity-50 rounded-xl p-6 sticky top-24"
                        >
                            <h2 className="text-xl font-semibold mb-4">
                                Booking Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        {entityType.charAt(0).toUpperCase() +
                                            entityType.slice(1)}
                                    </span>
                                    <span>{entityName}</span>
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
                        </motion.div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}
