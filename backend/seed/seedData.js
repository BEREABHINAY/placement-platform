// Populates the database with real course and test content so the platform
// isn't empty on first run. Safe to re-run — it clears and re-inserts.
//
// Usage:
//   cd backend
//   node seed/seedData.js
//
// Requires MONGO_URI to already be set in backend/.env

import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Course from "../models/Course.js";
import Test from "../models/Test.js";

dotenv.config();

const courses = [
  {
    title: "Mastering Data Structures & Algorithms",
    slug: "mastering-dsa",
    description:
      "A complete DSA track for placement interviews: arrays through graphs and dynamic programming, with the patterns interviewers actually ask about.",
    category: "DSA",
    level: "Intermediate",
    durationHours: 40,
    instructor: "Placement Platform Team",
    tags: ["DSA", "Interview Prep", "Coding Rounds"],
    modules: [
      { title: "Arrays & Strings", description: "Two-pointer, sliding window, and prefix-sum patterns.", durationMinutes: 240, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Linked Lists", description: "Singly/doubly linked lists, cycle detection, reversal.", durationMinutes: 180, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Stacks & Queues", description: "Monotonic stacks, circular queues, and their applications.", durationMinutes: 150, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Trees & Binary Search Trees", description: "Traversals, balancing, and BST operations.", durationMinutes: 240, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Graphs", description: "BFS, DFS, shortest paths, and topological sort.", durationMinutes: 270, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Dynamic Programming", description: "From memoization to tabulation, classic DP patterns.", durationMinutes: 300, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Sorting & Searching", description: "Comparison sorts, binary search variants.", durationMinutes: 150, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    ],
    rating: 4.8,
  },
  {
    title: "Complete Web Development with the MERN Stack",
    slug: "mern-stack-complete",
    description:
      "Build and deploy full-stack apps with MongoDB, Express, React, and Node — the exact stack most fresher full-stack roles expect.",
    category: "Web Development",
    level: "Beginner",
    durationHours: 50,
    instructor: "Placement Platform Team",
    tags: ["MERN", "Full Stack", "React", "Node.js"],
    modules: [
      { title: "HTML, CSS & Modern JavaScript", description: "ES6+, async/await, the DOM.", durationMinutes: 240, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "React Fundamentals", description: "Components, hooks, state, and props.", durationMinutes: 300, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Node.js & Express APIs", description: "Building REST APIs and middleware.", durationMinutes: 240, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "MongoDB & Mongoose", description: "Schema design, queries, and relationships.", durationMinutes: 210, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Authentication & Security", description: "JWT, password hashing, and OTP flows.", durationMinutes: 180, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Deployment", description: "Shipping to Vercel, Render, and MongoDB Atlas.", durationMinutes: 120, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    ],
    rating: 4.7,
  },
  {
    title: "Quantitative Aptitude for Placements",
    slug: "quantitative-aptitude",
    description: "Number systems, percentages, time-speed-distance, and data interpretation — the core of every aptitude round.",
    category: "Aptitude",
    level: "Beginner",
    durationHours: 20,
    instructor: "Placement Platform Team",
    tags: ["Aptitude", "Quant"],
    modules: [
      { title: "Number Systems & Simplification", description: "", durationMinutes: 120, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Percentages, Profit & Loss", description: "", durationMinutes: 120, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Time, Speed & Distance", description: "", durationMinutes: 120, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Permutations & Combinations", description: "", durationMinutes: 120, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Data Interpretation", description: "", durationMinutes: 150, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
    ],
    rating: 4.5,
  },
  {
    title: "Logical Reasoning Mastery",
    slug: "logical-reasoning-mastery",
    description: "Series, coding-decoding, blood relations, syllogisms, and puzzles — pattern-recognition drills for reasoning rounds.",
    category: "Aptitude",
    level: "Beginner",
    durationHours: 15,
    instructor: "Placement Platform Team",
    tags: ["Aptitude", "Logical Reasoning"],
    modules: [
      { title: "Series & Pattern Recognition", description: "", durationMinutes: 90, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Coding-Decoding", description: "", durationMinutes: 90, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Blood Relations", description: "", durationMinutes: 90, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Syllogisms", description: "", durationMinutes: 90, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Seating Arrangements & Puzzles", description: "", durationMinutes: 120, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    ],
    rating: 4.4,
  },
  {
    title: "Verbal Ability & Business English",
    slug: "verbal-ability-business-english",
    description: "Grammar, vocabulary, reading comprehension, and professional email writing for verbal rounds and workplace communication.",
    category: "Soft Skills",
    level: "Beginner",
    durationHours: 12,
    instructor: "Placement Platform Team",
    tags: ["Verbal Ability", "Communication"],
    modules: [
      { title: "Grammar Essentials", description: "", durationMinutes: 90, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Vocabulary Building", description: "", durationMinutes: 90, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Reading Comprehension", description: "", durationMinutes: 120, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Professional Email Writing", description: "", durationMinutes: 60, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    ],
    rating: 4.3,
  },
  {
    title: "System Design Fundamentals",
    slug: "system-design-fundamentals",
    description: "Scalability, load balancing, caching, and database choices — the concepts behind every system design interview question.",
    category: "System Design",
    level: "Advanced",
    durationHours: 25,
    instructor: "Placement Platform Team",
    tags: ["System Design", "Scalability"],
    modules: [
      { title: "Scalability Basics", description: "Vertical vs horizontal scaling.", durationMinutes: 120, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Load Balancing & Caching", description: "", durationMinutes: 150, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Database Selection & Sharding", description: "SQL vs NoSQL, replication.", durationMinutes: 180, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Microservices & APIs", description: "", durationMinutes: 150, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Case Studies", description: "Designing a URL shortener, a chat app, a news feed.", durationMinutes: 210, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
    ],
    rating: 4.6,
  },
  {
    title: "Core CS Fundamentals: OS, DBMS, CN & OOP",
    slug: "core-cs-fundamentals",
    description: "The four subjects every technical interviewer probes: operating systems, databases, computer networks, and object-oriented programming.",
    category: "Core CS",
    level: "Intermediate",
    durationHours: 30,
    instructor: "Placement Platform Team",
    tags: ["OS", "DBMS", "Computer Networks", "OOP"],
    modules: [
      { title: "Operating Systems", description: "Processes, threads, scheduling, deadlocks.", durationMinutes: 210, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Database Management Systems", description: "Normalization, transactions, indexing.", durationMinutes: 210, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Computer Networks", description: "OSI model, TCP/IP, HTTP, DNS.", durationMinutes: 180, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Object-Oriented Programming", description: "Encapsulation, inheritance, polymorphism, design principles.", durationMinutes: 180, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
    ],
    rating: 4.5,
  },
  {
    title: "AI/ML Foundations for Placements",
    slug: "ai-ml-foundations",
    description: "From supervised learning to neural network basics — enough ML fundamentals to speak confidently in AI/ML-track interviews.",
    category: "AI/ML",
    level: "Intermediate",
    durationHours: 28,
    instructor: "Placement Platform Team",
    tags: ["AI", "Machine Learning"],
    modules: [
      { title: "Introduction to Machine Learning", description: "", durationMinutes: 120, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Supervised Learning", description: "Regression, classification, evaluation metrics.", durationMinutes: 180, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Unsupervised Learning", description: "Clustering, dimensionality reduction.", durationMinutes: 150, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      { title: "Neural Network Basics", description: "Perceptrons, backpropagation, activation functions.", durationMinutes: 180, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/rabbit320.mp4" },
      { title: "Model Evaluation & Real-World Case Studies", description: "", durationMinutes: 150, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    ],
    rating: 4.6,
  },
];

const testsBlueprint = [
  {
    title: "Quantitative Aptitude Practice Test",
    type: "aptitude",
    category: "Quantitative",
    description: "Six questions covering profit & loss, speed-distance-time, percentages, averages, permutations, and simple interest.",
    durationMinutes: 20,
    passingPercent: 60,
    relatedCourseSlug: "quantitative-aptitude",
    questions: [
      { questionText: "The cost price of an item is ₹80. It is sold at a profit of 25%. What is the selling price?", options: ["₹90", "₹95", "₹100", "₹105"], correctOptionIndex: 2, marks: 1 },
      { questionText: "A train 120 m long crosses a pole in 6 seconds. What is its speed?", options: ["18 km/h", "54 km/h", "72 km/h", "90 km/h"], correctOptionIndex: 2, marks: 1 },
      { questionText: "What is 15% of 240?", options: ["30", "33", "36", "40"], correctOptionIndex: 2, marks: 1 },
      { questionText: "The average of five numbers is 27. If one number is excluded, the average becomes 25. Find the excluded number.", options: ["30", "33", "35", "40"], correctOptionIndex: 2, marks: 1 },
      { questionText: "In how many distinct ways can the letters of the word 'LEVEL' be arranged?", options: ["30", "60", "120", "20"], correctOptionIndex: 0, marks: 1 },
      { questionText: "A sum of money doubles itself in 8 years at simple interest. What is the annual rate of interest?", options: ["10%", "12.5%", "15%", "20%"], correctOptionIndex: 1, marks: 1 },
    ],
  },
  {
    title: "Logical Reasoning Practice Test",
    type: "aptitude",
    category: "Logical Reasoning",
    description: "Six questions covering number series, coding-decoding, blood relations, classification, and syllogisms.",
    durationMinutes: 20,
    passingPercent: 60,
    relatedCourseSlug: "logical-reasoning-mastery",
    questions: [
      { questionText: "Find the next number in the series: 2, 6, 12, 20, 30, ?", options: ["36", "40", "42", "44"], correctOptionIndex: 2, marks: 1 },
      { questionText: "If CAT is coded as DBU (each letter shifted forward by one), how is DOG coded?", options: ["EPH", "EPG", "FQI", "DPH"], correctOptionIndex: 0, marks: 1 },
      { questionText: "Pointing to a photograph, a man says, 'She is the daughter of my grandfather's only son.' How is the woman related to the man?", options: ["Daughter", "Sister", "Niece", "Wife"], correctOptionIndex: 1, marks: 1 },
      { questionText: "Which one does not belong with the others?", options: ["Apple", "Banana", "Carrot", "Mango"], correctOptionIndex: 2, marks: 1 },
      { questionText: "In a certain code, 'ROSE' is written as 'URVH' (each letter shifted forward by three). How is 'CHAIR' written?", options: ["FKDLU", "FKDLV", "EJDKT", "FKDMU"], correctOptionIndex: 0, marks: 1 },
      { questionText: "Statement: All cats are animals. Some animals are dogs. Conclusion: Some dogs are cats. Does the conclusion follow?", options: ["True, it always follows", "Cannot be determined from the statements", "Always false", "None of the above"], correctOptionIndex: 1, marks: 1 },
    ],
  },
  {
    title: "Verbal Ability & English Test",
    type: "aptitude",
    category: "Verbal Ability",
    description: "Six questions covering spelling, synonyms, antonyms, grammar, and punctuation.",
    durationMinutes: 15,
    passingPercent: 60,
    relatedCourseSlug: "verbal-ability-business-english",
    questions: [
      { questionText: "Choose the correctly spelled word.", options: ["Recieve", "Receive", "Receeve", "Recceive"], correctOptionIndex: 1, marks: 1 },
      { questionText: "Choose the synonym of 'Abundant'.", options: ["Scarce", "Plentiful", "Rare", "Limited"], correctOptionIndex: 1, marks: 1 },
      { questionText: "Choose the antonym of 'Ephemeral'.", options: ["Permanent", "Fleeting", "Temporary", "Brief"], correctOptionIndex: 0, marks: 1 },
      { questionText: "Fill in the blank: 'She has been working here ___ 2019.'", options: ["for", "since", "from", "at"], correctOptionIndex: 1, marks: 1 },
      { questionText: "Choose the correctly punctuated sentence.", options: ["Its a beautiful day, isnt it?", "It's a beautiful day, isn't it?", "Its a beautiful day, isn't it.", "It's a beautiful day isnt it?"], correctOptionIndex: 1, marks: 1 },
      { questionText: "Choose the sentence with correct subject-verb agreement.", options: ["Neither of the boys were present.", "Neither of the boys was present.", "Neither of the boy was present.", "Neither of boys was present."], correctOptionIndex: 1, marks: 1 },
    ],
  },
  {
    title: "Core CS & DSA Mock Test",
    type: "coding_mcq",
    category: "DSA",
    description: "Six conceptual questions on complexity, data structures, and traversal — the theory behind coding rounds.",
    durationMinutes: 20,
    passingPercent: 60,
    relatedCourseSlug: "mastering-dsa",
    questions: [
      { questionText: "What is the time complexity of binary search on a sorted array?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctOptionIndex: 1, marks: 1 },
      { questionText: "Which data structure follows LIFO (Last In, First Out) order?", options: ["Queue", "Stack", "Linked List", "Array"], correctOptionIndex: 1, marks: 1 },
      { questionText: "What is the worst-case time complexity of quicksort?", options: ["O(n log n)", "O(n^2)", "O(log n)", "O(n)"], correctOptionIndex: 1, marks: 1 },
      { questionText: "Which traversal of a binary search tree visits nodes in sorted order?", options: ["Preorder", "Postorder", "Inorder", "Level order"], correctOptionIndex: 2, marks: 1 },
      { questionText: "Which data structure is best suited for implementing a priority queue?", options: ["Array", "Linked List", "Heap", "Stack"], correctOptionIndex: 2, marks: 1 },
      { questionText: "In a well-implemented hash table, what is the average time complexity of a search?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correctOptionIndex: 2, marks: 1 },
    ],
  },
  {
    title: "HR & Behavioral Mock Interview Quiz",
    type: "mock",
    category: "HR / Behavioral",
    description: "Six questions on interview technique and behavioral-round best practices.",
    durationMinutes: 15,
    passingPercent: 60,
    relatedCourseSlug: null,
    questions: [
      { questionText: "In the STAR method for answering behavioral questions, what does the 'R' stand for?", options: ["Reason", "Result", "Response", "Review"], correctOptionIndex: 1, marks: 1 },
      { questionText: "What is the best approach when asked 'What is your biggest weakness?'", options: ["Say you have no weaknesses", "Share a real weakness and the steps you're taking to improve", "Deflect the question entirely", "Mention a strength instead"], correctOptionIndex: 1, marks: 1 },
      { questionText: "What should you research before a company interview?", options: ["Only the salary range", "The company's products, culture, and recent news", "Nothing — it's better to improvise", "Only the interviewer's personal social media"], correctOptionIndex: 1, marks: 1 },
      { questionText: "When asked 'Tell me about yourself,' what's the best structure?", options: ["A full life history from childhood", "Present role, relevant past experience, and why you're excited about this role", "Only your hobbies and interests", "A list of every certification you hold"], correctOptionIndex: 1, marks: 1 },
      { questionText: "Is it appropriate to ask questions at the end of an interview?", options: ["Yes — it shows genuine interest and preparation", "No — it wastes the interviewer's time", "Yes, but only about salary", "No — only the interviewer should ask questions"], correctOptionIndex: 0, marks: 1 },
      { questionText: "What does 'cultural fit' primarily assess?", options: ["Technical skills only", "Whether your values and work style align with the company", "Your educational background", "Your typing speed"], correctOptionIndex: 1, marks: 1 },
    ],
  },
];

(async () => {
  await connectDB();

  console.log("Clearing existing courses and tests...");
  await Course.deleteMany({});
  await Test.deleteMany({});

  console.log("Inserting courses...");
  const insertedCourses = await Course.insertMany(courses);
  const courseBySlug = Object.fromEntries(insertedCourses.map((c) => [c.slug, c]));

  console.log("Inserting tests...");
  for (const t of testsBlueprint) {
    const { relatedCourseSlug, ...rest } = t;
    await Test.create({
      ...rest,
      relatedCourse: relatedCourseSlug ? courseBySlug[relatedCourseSlug]?._id : undefined,
    });
  }

  console.log(`Done. Seeded ${insertedCourses.length} courses and ${testsBlueprint.length} tests.`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
