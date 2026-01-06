// Messages Store - manages seller conversations with localStorage persistence

const MESSAGES_KEY = "vintly_messages";
const CONVERSATIONS_KEY = "vintly_conversations";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  createdAt: string;
}

// Get all conversations for a user (as seller or buyer)
export function getConversations(userId: string): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    const conversations: Conversation[] = stored ? JSON.parse(stored) : [];
    return conversations
      .filter((c) => c.sellerId === userId || c.buyerId === userId)
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  } catch {
    return [];
  }
}

// Get seller conversations only
export function getSellerConversations(sellerId: string): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    const conversations: Conversation[] = stored ? JSON.parse(stored) : [];
    return conversations
      .filter((c) => c.sellerId === sellerId)
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  } catch {
    return [];
  }
}

// Get a specific conversation
export function getConversation(conversationId: string): Conversation | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    const conversations: Conversation[] = stored ? JSON.parse(stored) : [];
    return conversations.find((c) => c.id === conversationId) || null;
  } catch {
    return null;
  }
}

// Get messages for a conversation
export function getMessages(conversationId: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    const messages: Message[] = stored ? JSON.parse(stored) : [];
    return messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } catch {
    return [];
  }
}

// Create or get existing conversation
export function getOrCreateConversation(
  productId: string,
  productTitle: string,
  productImage: string,
  productPrice: number,
  sellerId: string,
  sellerName: string,
  sellerAvatar: string,
  buyerId: string,
  buyerName: string,
  buyerAvatar: string
): Conversation {
  const stored = localStorage.getItem(CONVERSATIONS_KEY);
  const conversations: Conversation[] = stored ? JSON.parse(stored) : [];

  // Check if conversation already exists
  const existing = conversations.find(
    (c) => c.productId === productId && c.buyerId === buyerId && c.sellerId === sellerId
  );

  if (existing) return existing;

  // Create new conversation
  const newConversation: Conversation = {
    id: `conv_${Date.now()}`,
    productId,
    productTitle,
    productImage,
    productPrice,
    sellerId,
    sellerName,
    sellerAvatar,
    buyerId,
    buyerName,
    buyerAvatar,
    lastMessage: "",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  };

  conversations.push(newConversation);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));

  return newConversation;
}

// Send a message
export function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  senderAvatar: string,
  content: string
): Message {
  // Create message
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    conversationId,
    senderId,
    senderName,
    senderAvatar,
    content,
    timestamp: new Date().toISOString(),
    read: false,
  };

  // Save message
  const storedMessages = localStorage.getItem(MESSAGES_KEY);
  const messages: Message[] = storedMessages ? JSON.parse(storedMessages) : [];
  messages.push(newMessage);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

  // Update conversation
  const storedConversations = localStorage.getItem(CONVERSATIONS_KEY);
  const conversations: Conversation[] = storedConversations ? JSON.parse(storedConversations) : [];
  const convIndex = conversations.findIndex((c) => c.id === conversationId);
  
  if (convIndex !== -1) {
    conversations[convIndex].lastMessage = content;
    conversations[convIndex].lastMessageTime = newMessage.timestamp;
    
    // Increment unread count for the other party
    const isSeller = conversations[convIndex].sellerId === senderId;
    if (!isSeller) {
      conversations[convIndex].unreadCount += 1;
    }
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  }

  // Dispatch event for real-time updates
  window.dispatchEvent(new CustomEvent("messagesUpdated", { detail: { conversationId } }));

  return newMessage;
}

// Mark conversation as read
export function markConversationAsRead(conversationId: string, userId: string): void {
  // Mark messages as read
  const storedMessages = localStorage.getItem(MESSAGES_KEY);
  const messages: Message[] = storedMessages ? JSON.parse(storedMessages) : [];
  
  messages.forEach((m) => {
    if (m.conversationId === conversationId && m.senderId !== userId) {
      m.read = true;
    }
  });
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

  // Reset unread count in conversation
  const storedConversations = localStorage.getItem(CONVERSATIONS_KEY);
  const conversations: Conversation[] = storedConversations ? JSON.parse(storedConversations) : [];
  const convIndex = conversations.findIndex((c) => c.id === conversationId);
  
  if (convIndex !== -1) {
    // Only reset if user is the seller
    if (conversations[convIndex].sellerId === userId) {
      conversations[convIndex].unreadCount = 0;
    }
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  }

  window.dispatchEvent(new CustomEvent("messagesUpdated", { detail: { conversationId } }));
}

// Get total unread count for seller
export function getUnreadCount(sellerId: string): number {
  const conversations = getSellerConversations(sellerId);
  return conversations.reduce((total, c) => total + c.unreadCount, 0);
}

// Generate sample conversations for demo
export function generateSampleConversations(sellerId: string, sellerName: string): void {
  const stored = localStorage.getItem(CONVERSATIONS_KEY);
  const existing: Conversation[] = stored ? JSON.parse(stored) : [];
  
  // Only generate if no conversations exist for this seller
  if (existing.some((c) => c.sellerId === sellerId)) return;

  const sampleBuyers = [
    { id: "buyer_1", name: "Sophie Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
    { id: "buyer_2", name: "Emma Wilson", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" },
    { id: "buyer_3", name: "Olivia Martinez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
  ];

  const sampleProducts = [
    { id: "demo_1", title: "Chanel Classic Flap", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300", price: 4500 },
    { id: "demo_2", title: "Hermès Birkin 30", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300", price: 12000 },
  ];

  const sampleConversations: Conversation[] = sampleBuyers.map((buyer, i) => ({
    id: `conv_sample_${i}`,
    productId: sampleProducts[i % sampleProducts.length].id,
    productTitle: sampleProducts[i % sampleProducts.length].title,
    productImage: sampleProducts[i % sampleProducts.length].image,
    productPrice: sampleProducts[i % sampleProducts.length].price,
    sellerId,
    sellerName,
    sellerAvatar: "",
    buyerId: buyer.id,
    buyerName: buyer.name,
    buyerAvatar: buyer.avatar,
    lastMessage: i === 0 ? "Is this still available?" : i === 1 ? "Can you share more photos?" : "What's the lowest you'll go?",
    lastMessageTime: new Date(Date.now() - i * 3600000).toISOString(),
    unreadCount: i === 0 ? 1 : 0,
    createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
  }));

  const sampleMessages: Message[] = sampleConversations.flatMap((conv, i) => [
    {
      id: `msg_sample_${i}_1`,
      conversationId: conv.id,
      senderId: conv.buyerId,
      senderName: conv.buyerName,
      senderAvatar: conv.buyerAvatar,
      content: conv.lastMessage,
      timestamp: conv.lastMessageTime,
      read: i !== 0,
    },
  ]);

  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify([...existing, ...sampleConversations]));
  
  const storedMessages = localStorage.getItem(MESSAGES_KEY);
  const existingMessages: Message[] = storedMessages ? JSON.parse(storedMessages) : [];
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([...existingMessages, ...sampleMessages]));
}

