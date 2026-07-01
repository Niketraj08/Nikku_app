import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Video from '../models/Video.js';
import Homepage from '../models/Homepage.js';
import { connectDB } from '../config/db.js';

const categories = [
  { name: 'Mathematics', slug: 'mathematics', icon: 'FaCalculator', color: '#6366f1', isFeatured: true, order: 1 },
  { name: 'Physics', slug: 'physics', icon: 'FaAtom', color: '#8b5cf6', isFeatured: true, order: 2 },
  { name: 'Chemistry', slug: 'chemistry', icon: 'FaFlask', color: '#d946ef', isFeatured: true, order: 3 },
  { name: 'Biology', slug: 'biology', icon: 'FaDna', color: '#10b981', isFeatured: true, order: 4 },
  { name: 'Computer Science', slug: 'computer-science', icon: 'FaCode', color: '#3b82f6', isFeatured: true, order: 5 },
  { name: 'English', slug: 'english', icon: 'FaBook', color: '#f59e0b', isFeatured: true, order: 6 },
  { name: 'History', slug: 'history', icon: 'FaLandmark', color: '#ef4444', isFeatured: true, order: 7 },
  { name: 'Economics', slug: 'economics', icon: 'FaChartLine', color: '#06b6d4', isFeatured: true, order: 8 },
];

const sampleVideos = [
  {
    title: 'Introduction to Algebra',
    slug: 'intro-algebra',
    description: 'Master the fundamentals of algebra with clear explanations and practice problems.',
    thumbnail: 'https://img.youtube.com/vi/NybHckSEQBI/maxresdefault.jpg',
    duration: 1245,
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/NybHckSEQBI',
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    tags: ['algebra', 'math', 'basics'],
    categorySlug: 'mathematics',
  },
  {
    title: 'Newton\'s Laws of Motion',
    slug: 'newtons-laws',
    description: 'Understand Newton\'s three laws of motion with real-world examples.',
    thumbnail: 'https://img.youtube.com/vi/kKKM32Yil48/maxresdefault.jpg',
    duration: 890,
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/kKKM32Yil48',
    isFeatured: true,
    isPopular: true,
    tags: ['physics', 'mechanics'],
    categorySlug: 'physics',
  },
  {
    title: 'Organic Chemistry Basics',
    slug: 'organic-chemistry-basics',
    description: 'Learn the building blocks of organic chemistry.',
    thumbnail: 'https://img.youtube.com/vi/B_ketdzJtY8/maxresdefault.jpg',
    duration: 1560,
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/B_ketdzJtY8',
    isFeatured: true,
    isTrending: true,
    tags: ['chemistry', 'organic'],
    categorySlug: 'chemistry',
  },
  {
    title: 'Cell Biology Overview',
    slug: 'cell-biology',
    description: 'Explore the structure and function of cells.',
    thumbnail: 'https://img.youtube.com/vi/URUJD5NEXC8/maxresdefault.jpg',
    duration: 720,
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/URUJD5NEXC8',
    isPopular: true,
    tags: ['biology', 'cells'],
    categorySlug: 'biology',
  },
  {
    title: 'Python Programming for Beginners',
    slug: 'python-beginners',
    description: 'Start your coding journey with Python fundamentals.',
    thumbnail: 'https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg',
    duration: 3600,
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    tags: ['python', 'programming'],
    categorySlug: 'computer-science',
  },
  {
    title: 'English Grammar Essentials',
    slug: 'english-grammar',
    description: 'Master essential English grammar rules.',
    thumbnail: 'https://img.youtube.com/vi/WG5WV9N_Jss/maxresdefault.jpg',
    duration: 980,
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/WG5WV9N_Jss',
    isPopular: true,
    tags: ['english', 'grammar'],
    categorySlug: 'english',
  },
  {
    title: 'World War II Overview',
    slug: 'ww2-overview',
    description: 'A comprehensive overview of World War II events.',
    thumbnail: 'https://img.youtube.com/vi/HUqy-OQvV5M/maxresdefault.jpg',
    duration: 1100,
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/HUqy-OQvV5M',
    isTrending: true,
    tags: ['history', 'ww2'],
    categorySlug: 'history',
  },
  {
    title: 'Microeconomics Fundamentals',
    slug: 'microeconomics',
    description: 'Learn supply, demand, and market equilibrium.',
    thumbnail: 'https://img.youtube.com/vi/8JYP_wUWRcs/maxresdefault.jpg',
    duration: 840,
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/embed/8JYP_wUWRcs',
    isFeatured: true,
    tags: ['economics', 'micro'],
    categorySlug: 'economics',
  },
];

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Video.deleteMany({}),
    Homepage.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@akkistudy.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
    isVerified: true,
  });

  const createdCategories = {};
  for (const cat of categories) {
    const c = await Category.create(cat);
    createdCategories[cat.slug] = c._id;
  }

  const createdVideos = [];
  for (const v of sampleVideos) {
    const { categorySlug, ...data } = v;
    const video = await Video.create({
      ...data,
      category: createdCategories[categorySlug],
      createdBy: admin._id,
    });
    createdVideos.push(video);
    await Category.findByIdAndUpdate(createdCategories[categorySlug], { $inc: { videoCount: 1 } });
  }

  await Homepage.create({
    heroTitle: 'AKKI STUDY X',
    heroSubtitle: 'Premium Edition — Learn without limits. 100% free access to world-class educational content.',
    heroCta: 'Start Learning Free',
    testimonials: [
      {
        name: 'Priya Sharma',
        role: 'Class 12 Student',
        content: 'AKKI STUDY X helped me score 95% in my board exams. The video quality and explanations are amazing!',
        avatar: '',
        rating: 5,
      },
      {
        name: 'Rahul Verma',
        role: 'JEE Aspirant',
        content: 'Best free learning platform I have found. Physics and Math videos are incredibly detailed.',
        avatar: '',
        rating: 5,
      },
      {
        name: 'Ananya Patel',
        role: 'College Student',
        content: 'The playlist feature and notes system make studying so much more organized. Love it!',
        avatar: '',
        rating: 5,
      },
    ],
    ctaTitle: 'Ready to Start Your Learning Journey?',
    ctaSubtitle: 'Join thousands of students learning for free on AKKI STUDY X',
    featuredCourseIds: createdVideos.filter((v) => v.isFeatured).map((v) => v._id),
  });

  console.log('Seed complete!');
  console.log('Admin:', process.env.ADMIN_EMAIL || 'admin@akkistudy.com');
  console.log('Password:', process.env.ADMIN_PASSWORD || 'Admin@123456');
  await mongoose.disconnect();
};

seed().catch(console.error);
