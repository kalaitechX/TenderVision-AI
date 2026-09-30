require('dotenv').config();
const mongoose = require('mongoose');
const Tender = require('./models/Tender');
const User = require('./models/User');

const tendersData = [
    { id: '1024', title: 'Smart City IT Infrastructure Upgrade', org: 'Ministry of Urban Dev', value: 2500000, deadline: '2026-08-15', status: 'Open', region: 'North America', winProb: 94, category: 'it', catLabel: 'IT Infrastructure', reqs: ['ISO 27001', 'Cloud Hosting', '24/7 Support'], desc: 'Complete overhaul of data center and edge computing nodes across 5 smart city zones.' },
    { id: '1025', title: 'Defense AI Surveillance Grid', org: 'Dept of Defense', value: 8000000, deadline: '2026-09-01', status: 'Reviewing', region: 'Europe', winProb: 88, category: 'ai', catLabel: 'AI/ML', reqs: ['Security Clearance', 'On-premise deployment'], desc: 'Implementation of AI-driven threat detection systems using existing camera networks.' },
    { id: '1026', title: 'National Health DB Migration', org: 'Dept of Health', value: 1200000, deadline: '2026-08-20', status: 'Open', region: 'North America', winProb: 91, category: 'cloud', catLabel: 'Cloud Migration', reqs: ['HIPAA Compliance', 'AWS GovCloud'], desc: 'Migrating legacy health records to secure AWS GovCloud instances.' },
    { id: '1027', title: 'Public Transport Route Optimization AI', org: 'Transit Authority', value: 3400000, deadline: '2026-10-10', status: 'Drafting', region: 'Asia Pacific', winProb: 85, category: 'ai', catLabel: 'AI/ML', reqs: ['Real-time analytics', 'Mobile App Integration'], desc: 'Machine learning model to predict passenger flow and optimize bus schedules dynamically.' },
    { id: '1028', title: 'Cybersecurity Audit & Penetration Testing', org: 'Central Bank', value: 850000, deadline: '2026-08-05', status: 'Open', region: 'Middle East', winProb: 96, category: 'security', catLabel: 'Cybersecurity', reqs: ['SOC 2', 'Penetration Testing'], desc: 'Comprehensive security audit of the newly launched digital currency platform.' },
    { id: '1029', title: 'Rural Broadband Expansion (Phase 3)', org: 'Telecom Ministry', value: 12500000, deadline: '2026-11-15', status: 'Open', region: 'Latin America', winProb: 78, category: 'it', catLabel: 'IT Infrastructure', reqs: ['Fiber Optic Cable', '5G Towers'], desc: 'Laying fiber optic cables and setting up 5G towers in tier-3 cities.' }
];

const adminUsers = [
    { id: 1, name: 'Alice Smith', email: 'alice@company.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Jones', email: 'bob@company.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@company.com', role: 'Viewer', status: 'Suspended' }
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Tender.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        await Tender.insertMany(tendersData);
        await User.insertMany(adminUsers);
        console.log('Database seeded successfully');

        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding DB:', err);
        mongoose.connection.close();
    }
}

seedDB();
