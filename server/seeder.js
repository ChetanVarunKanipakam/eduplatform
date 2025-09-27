import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// Load models
import Subject from './models/Subject.js';
import Lesson from './models/Lesson.js';

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// --- DUMMY DATA ---

const lessons = [
    {
        _id: new mongoose.Types.ObjectId(),
        title: 'Introduction to JavaScript Variables',
        content: 'In JavaScript, you can declare variables using var, let, and const. `let` and `const` are block-scoped, which is a key feature introduced in ES6.',
        hasCodeEditor: true,
        codeSnippet: `let name = 'EduPlatform';\nconst year = 2024;\nconsole.log(name, year);`
    },
    {
        _id: new mongoose.Types.ObjectId(),
        title: 'Understanding Functions',
        content: 'Functions are one of the fundamental building blocks in JavaScript. A function is a reusable set of statements to perform a task or calculate a value.',
        hasCodeEditor: true,
        codeSnippet: `function greet(name) {\n  return 'Hello, ' + name;\n}\n\nconsole.log(greet('World'));`
    },
    {
        _id: new mongoose.Types.ObjectId(),
        title: 'What is the DOM?',
        content: 'The Document Object Model (DOM) is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content.',
        links: [
            { title: 'MDN - Introduction to the DOM', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction' }
        ]
    },
    {
        _id: new mongoose.Types.ObjectId(),
        title: 'Understanding JSX',
        content: 'JSX stands for JavaScript XML. It is a syntax extension for JavaScript, and it allows you to write HTML-like code in your React components.',
        hasCodeEditor: true,
        codeSnippet: `const element = <h1>Hello, world!</h1>;\nReactDOM.render(element, document.getElementById('root'));`
    },
    {
        _id: new mongoose.Types.ObjectId(),
        title: 'React Components',
        content: 'Components are the heart of React. They are independent and reusable bits of code. They serve the same purpose as JavaScript functions, but work in isolation and return HTML.',
        hasCodeEditor: true,
        codeSnippet: `function Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}`
    },
    {
        _id: new mongoose.Types.ObjectId(),
        title: 'State and Lifecycle',
        content: 'State is similar to props, but it is private and fully controlled by the component. Lifecycle methods are custom functionality that gets executed during the different phases of a component.',
        links: [
             { title: 'React Docs - State and Lifecycle', url: 'https://react.dev/learn/state-a-components-memory' },
             { title: 'W3Schools - React State', url: 'https://www.w3schools.com/react/react_state.asp' }
        ]
    }
];

const subjects = [
    {
        title: 'JavaScript Fundamentals',
        description: 'Learn the core concepts of JavaScript, the most popular programming language in the world.',
        // Link the first three lessons
        lessons: [lessons[0]._id, lessons[1]._id, lessons[2]._id]
    },
    {
        title: 'React for Beginners',
        description: 'Get started with React to build modern, fast, and scalable user interfaces.',
        // Link the next three lessons
        lessons: [lessons[3]._id, lessons[4]._id, lessons[5]._id]
    },
    {
        title: 'Node.js Basics',
        description: 'Explore the fundamentals of Node.js for building backend services.',
        lessons: [] // No lessons yet for this subject
    }
];

// Import data into DB
const importData = async () => {
  try {
    await Lesson.deleteMany();
    await Subject.deleteMany();

    await Lesson.create(lessons);
    await Subject.create(subjects);

    console.log('✅ Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Lesson.deleteMany();
    await Subject.deleteMany();
    console.log('🗑️ Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') { // To import: node seeder -i
  importData();
} else if (process.argv[2] === '-d') { // To destroy: node seeder -d
  deleteData();
} else {
  console.log('Please add an option: -i to import data or -d to delete data');
  process.exit();
}