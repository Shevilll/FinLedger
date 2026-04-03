import { Transaction, Category } from '@/types';

const categories: Category[] = [
    'Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities',
    'Entertainment', 'Health & Fitness', 'Education', 'Salary',
    'Freelance', 'Investment', 'Rent', 'Travel', 'Subscriptions', 'Groceries', 'Other'
];

const merchants: Record<Category, string[]> = {
    'Food & Dining': ['Starbucks', 'Chipotle', 'Uber Eats', 'DoorDash', 'Olive Garden', 'Sushi Palace'],
    'Transportation': ['Uber', 'Lyft', 'Shell Gas', 'BP Fuel', 'Metro Card'],
    'Shopping': ['Amazon', 'Target', 'Best Buy', 'Nike Store', 'IKEA', 'Zara'],
    'Bills & Utilities': ['Electric Co.', 'Water Dept.', 'Internet Provider', 'Phone Bill'],
    'Entertainment': ['Netflix', 'Spotify', 'AMC Theaters', 'Steam', 'Xbox Live'],
    'Health & Fitness': ['Planet Fitness', 'CVS Pharmacy', 'Whole Foods Vitamins', 'Yoga Studio'],
    'Education': ['Udemy', 'Coursera', 'Book Depository', 'Skillshare'],
    'Salary': ['TechCorp Inc.', 'Acme Solutions', 'GlobalTech Ltd.'],
    'Freelance': ['Client - WebDev', 'Client - Design', 'Upwork', 'Fiverr'],
    'Investment': ['Vanguard', 'Robinhood', 'Coinbase', 'Dividend - AAPL'],
    'Rent': ['Apartment Complex', 'Property Management'],
    'Travel': ['Delta Airlines', 'Marriott Hotel', 'Airbnb', 'Booking.com'],
    'Subscriptions': ['Adobe CC', 'GitHub Pro', 'iCloud+', 'YouTube Premium'],
    'Groceries': ['Whole Foods', 'Trader Joe\'s', 'Costco', 'Walmart Grocery', 'Kroger'],
    'Other': ['Miscellaneous', 'ATM Withdrawal', 'Gift Store']
};

const descriptions: Record<Category, string[]> = {
    'Food & Dining': ['Morning coffee', 'Lunch with team', 'Dinner delivery', 'Weekend brunch', 'Quick bite'],
    'Transportation': ['Ride to office', 'Gas refuel', 'Monthly transit pass', 'Airport ride'],
    'Shopping': ['Online order', 'New sneakers', 'Home decor', 'Electronics purchase', 'Clothing haul'],
    'Bills & Utilities': ['Monthly electricity', 'Water bill', 'Internet service', 'Phone plan'],
    'Entertainment': ['Streaming subscription', 'Movie night', 'Game purchase', 'Concert tickets'],
    'Health & Fitness': ['Gym membership', 'Prescription refill', 'Supplements', 'Yoga class'],
    'Education': ['Online course', 'Book purchase', 'Workshop fee', 'Certification exam'],
    'Salary': ['Monthly salary deposit', 'Bi-weekly paycheck', 'Bonus payment'],
    'Freelance': ['Web development project', 'Design consultation', 'Content writing gig'],
    'Investment': ['Stock purchase', 'Crypto investment', 'Dividend received', 'Bond interest'],
    'Rent': ['Monthly rent payment', 'Parking space rental'],
    'Travel': ['Flight booking', 'Hotel reservation', 'Vacation rental', 'Travel insurance'],
    'Subscriptions': ['Software subscription', 'Cloud storage', 'Premium membership'],
    'Groceries': ['Weekly grocery run', 'Bulk shopping', 'Fresh produce', 'Pantry restock'],
    'Other': ['Miscellaneous purchase', 'Cash withdrawal', 'Gift purchase']
};

function randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}

function generateTransactions(): Transaction[] {
    const transactions: Transaction[] = [];

    // Generate 6 months of salary income (Oct 2025 - Mar 2026)
    const salaryMonths = [
        '2025-10-01', '2025-11-01', '2025-12-01',
        '2026-01-02', '2026-02-02', '2026-03-01'
    ];

    salaryMonths.forEach(date => {
        transactions.push({
            id: generateId(),
            date,
            amount: 8500,
            category: 'Salary',
            type: 'income',
            description: 'Monthly salary deposit',
            merchant: 'TechCorp Inc.'
        });
    });

    // Freelance income (sporadic)
    const freelanceDates = ['2025-10-15', '2025-11-22', '2026-01-10', '2026-02-18', '2026-03-08'];
    freelanceDates.forEach(date => {
        transactions.push({
            id: generateId(),
            date,
            amount: 800 + Math.floor(Math.random() * 2200),
            category: 'Freelance',
            type: 'income',
            description: randomFromArray(descriptions['Freelance']),
            merchant: randomFromArray(merchants['Freelance'])
        });
    });

    // Investment returns
    const investmentDates = ['2025-10-20', '2025-12-15', '2026-01-25', '2026-03-10'];
    investmentDates.forEach(date => {
        transactions.push({
            id: generateId(),
            date,
            amount: 150 + Math.floor(Math.random() * 500),
            category: 'Investment',
            type: 'income',
            description: randomFromArray(descriptions['Investment']),
            merchant: randomFromArray(merchants['Investment'])
        });
    });

    // Rent (monthly expense)
    salaryMonths.forEach(date => {
        const rentDate = date.replace('-01', '-05').replace('-02', '-05');
        transactions.push({
            id: generateId(),
            date: rentDate,
            amount: 2200,
            category: 'Rent',
            type: 'expense',
            description: 'Monthly rent payment',
            merchant: 'Apartment Complex'
        });
    });

    // Regular expenses across categories
    const expenseCategories: Category[] = [
        'Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities',
        'Entertainment', 'Health & Fitness', 'Groceries', 'Subscriptions'
    ];

    const amountRanges: Record<string, [number, number]> = {
        'Food & Dining': [8, 75],
        'Transportation': [10, 65],
        'Shopping': [25, 350],
        'Bills & Utilities': [45, 180],
        'Entertainment': [10, 60],
        'Health & Fitness': [20, 120],
        'Groceries': [35, 180],
        'Subscriptions': [5, 30]
    };

    // Generate 3-6 transactions per category per month
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
        const year = monthOffset < 3 ? 2025 : 2026;
        const month = monthOffset < 3 ? 10 + monthOffset : monthOffset - 2;

        expenseCategories.forEach(cat => {
            const count = 2 + Math.floor(Math.random() * 4);
            for (let i = 0; i < count; i++) {
                const day = 1 + Math.floor(Math.random() * 27);
                const [min, max] = amountRanges[cat] || [10, 100];
                const amount = min + Math.floor(Math.random() * (max - min));

                transactions.push({
                    id: generateId(),
                    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    amount,
                    category: cat,
                    type: 'expense',
                    description: randomFromArray(descriptions[cat]),
                    merchant: randomFromArray(merchants[cat])
                });
            }
        });

        // Occasional education & travel expenses
        if (Math.random() > 0.5) {
            const day = 5 + Math.floor(Math.random() * 20);
            transactions.push({
                id: generateId(),
                date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                amount: 30 + Math.floor(Math.random() * 200),
                category: 'Education',
                type: 'expense',
                description: randomFromArray(descriptions['Education']),
                merchant: randomFromArray(merchants['Education'])
            });
        }

        if (Math.random() > 0.7) {
            const day = 10 + Math.floor(Math.random() * 15);
            transactions.push({
                id: generateId(),
                date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                amount: 200 + Math.floor(Math.random() * 800),
                category: 'Travel',
                type: 'expense',
                description: randomFromArray(descriptions['Travel']),
                merchant: randomFromArray(merchants['Travel'])
            });
        }
    }

    // Sort by date descending
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return transactions;
}

// Generate once and export as a stable dataset
export const mockTransactions: Transaction[] = generateTransactions();

// Category colors for charts
export const categoryColors: Record<Category, string> = {
    'Food & Dining': '#C26B52',
    'Transportation': '#7B8FA3',
    'Shopping': '#D4A04A',
    'Bills & Utilities': '#8B7355',
    'Entertainment': '#A87BAC',
    'Health & Fitness': '#5D9E6F',
    'Education': '#6B85A5',
    'Salary': '#5D9E6F',
    'Freelance': '#4A9E8F',
    'Investment': '#C4963C',
    'Rent': '#B85C45',
    'Travel': '#9B6FA0',
    'Subscriptions': '#7A7265',
    'Groceries': '#8BAD5B',
    'Other': '#6D655B'
};
