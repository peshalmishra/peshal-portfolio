"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";

export function Contact() {
    return (
        <section id="contact" className="py-24 px-6 md:px-12 max-w-2xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold tracking-tight">Let&apos;s Connect</h2>
                    <p className="mt-4 text-neutral-600 dark:text-neutral-400 font-light text-lg">
                        Have a project in mind or just want to chat about scalable systems?
                        Send me a message.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium pl-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-light"
                                placeholder="Jane Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium pl-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-light"
                                placeholder="jane@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium pl-1">Message</label>
                        <textarea
                            id="message"
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-light resize-none"
                            placeholder="Hi Peshal, I'd like to talk about..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full md:w-auto px-8 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                    >
                        <span>Send Message</span>
                        <Send className="w-4 h-4 ml-2" />
                    </button>
                </form>
            </motion.div>
        </section>
    );
}
