"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function AdminMessages() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    setMounted(true);
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      router.push("/admin");
    } else {
      fetchMessages();
    }
  }, [router]);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    setDeleting(id);
    try {
      const response = await fetch(`/api/messages?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages(messages.filter((m) => m._id !== id));
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleMarkRead = async (message) => {
    if (message.read) return;
    
    try {
      await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: message._id }),
      });

      setMessages(messages.map((m) => 
        m._id === message._id ? { ...m, read: true } : m
      ));
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-medium text-gray-900 dark:text-white">
            Messages {unreadCount > 0 && `(${unreadCount})`}
          </span>
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div>
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Messages
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Messages from the contact form
              </p>
            </div>

            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 lg:p-16">
                <div className="animate-pulse space-y-4 max-w-md mx-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 lg:p-20 text-center">
                <svg className="w-16 h-16 lg:w-20 lg:h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No messages yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                  When visitors send messages through the contact form, they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
                {/* Messages List */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        onClick={() => {
                          setSelectedMessage(message);
                          handleMarkRead(message);
                        }}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedMessage?._id === message._id
                            ? "bg-gray-100 dark:bg-gray-700"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        } ${!message.read ? "border-l-4 border-blue-500" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm truncate ${!message.read ? "font-semibold text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                              {message.email}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                              {message.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(message._id);
                            }}
                            disabled={deleting === message._id}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
                  {selectedMessage ? (
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {selectedMessage.email}
                          </h3>
                          {selectedMessage.phone && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {selectedMessage.phone}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {formatDate(selectedMessage.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(selectedMessage._id)}
                          disabled={deleting === selectedMessage._id}
                          className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm rounded hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[300px] lg:min-h-[400px] flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">Select a message to read</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
