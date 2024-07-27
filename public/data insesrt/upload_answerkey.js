// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('coaching');

// Data
const questionIds = [
    ObjectId("66a390bf9beb2ee7739168a4"),
    ObjectId("66a390bf9beb2ee7739168a5"),
    ObjectId("66a390bf9beb2ee7739168a6"),
    ObjectId("66a390bf9beb2ee7739168a7"),
    ObjectId("66a390bf9beb2ee7739168a8"),
    ObjectId("66a390bf9beb2ee7739168a9"),
    ObjectId("66a390bf9beb2ee7739168aa"),
    ObjectId("66a390bf9beb2ee7739168ab"),
    ObjectId("66a390bf9beb2ee7739168ac"),
    ObjectId("66a390bf9beb2ee7739168ad"),
    ObjectId("66a390bf9beb2ee7739168ae"),
    ObjectId("66a390bf9beb2ee7739168af"),
    ObjectId("66a390bf9beb2ee7739168b0"),
    ObjectId("66a390bf9beb2ee7739168b1"),
    ObjectId("66a390bf9beb2ee7739168b2"),
    ObjectId("66a390bf9beb2ee7739168b3"),
    ObjectId("66a390bf9beb2ee7739168b4"),
    ObjectId("66a390bf9beb2ee7739168b5"),
    ObjectId("66a390bf9beb2ee7739168b6"),
    ObjectId("66a390bf9beb2ee7739168b7"),
    ObjectId("66a390bf9beb2ee7739168b8"),
    ObjectId("66a390bf9beb2ee7739168b9"),
    ObjectId("66a390bf9beb2ee7739168ba"),
    ObjectId("66a390bf9beb2ee7739168bb"),
    ObjectId("66a390bf9beb2ee7739168bc"),
    ObjectId("66a390bf9beb2ee7739168bd"),
    ObjectId("66a390bf9beb2ee7739168be"),
    ObjectId("66a390bf9beb2ee7739168bf"),
    ObjectId("66a390bf9beb2ee7739168c0"),
    ObjectId("66a390bf9beb2ee7739168c1")
];

const studentIds = [
    ObjectId("66a396dfa71545bf0b0d0774"),
    ObjectId("66a396dfa71545bf0b0d0775"),
    ObjectId("66a396dfa71545bf0b0d0776"),
    ObjectId("66a396dfa71545bf0b0d0777"),
    ObjectId("66a396dfa71545bf0b0d0778"),
    ObjectId("66a396dfa71545bf0b0d0779"),
    ObjectId("66a396dfa71545bf0b0d077a"),
    ObjectId("66a396dfa71545bf0b0d077b"),
    ObjectId("66a396dfa71545bf0b0d077c"),
    ObjectId("66a396dfa71545bf0b0d077d")
];

const examPaperId = ObjectId("66a3940e791935a6f3137b87");

// Helper function to get a random element from an array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Fetch the questions from the database
const questions = db.getCollection('questions').find({ _id: { $in: questionIds } }).toArray();

// Generate answer keys for all students and all questions
const answerKeys = [];

studentIds.forEach(studentId => {
    questions.forEach(question => {
        const studentAnswer = getRandomElement(question.options);
        answerKeys.push({
            question: question._id,
            studentAnswer: studentAnswer, // Randomly selected answer
            noOfVisits: Math.floor(Math.random() * 5) + 1, // Random number of visits between 1 and 5
            actualTimeSpent: Math.floor(Math.random() * 300) + 30, // Random time spent between 30 and 330 seconds
            examPaper: examPaperId,
            student: studentId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });
});

// Insert answer keys into the collection
db.getCollection('answerkeys').insertMany(answerKeys);
