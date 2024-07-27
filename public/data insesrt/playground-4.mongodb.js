// MongoDB Playground

// The current database to use.
use('coaching');

// Define the exam paper ID.
const examPaperId = ObjectId("66a3940e791935a6f3137b87");

try {
    // Retrieve answer keys for the specified exam paper.
    const answerKeys = db.getCollection('answerkeys').find({ examPaper: examPaperId }).toArray();

    if (answerKeys.length === 0) {
        console.log("No answer keys found for the specified exam paper ID.");
    } else {
        // Initialize an object to store student IDs and their corresponding answer key IDs.
        const studentIds = {
            "66a396dfa71545bf0b0d0774": [],
            "66a396dfa71545bf0b0d0775": [],
            "66a396dfa71545bf0b0d0776": [],
            "66a396dfa71545bf0b0d0777": [],
            "66a396dfa71545bf0b0d0778": [],
            "66a396dfa71545bf0b0d0779": [],
            "66a396dfa71545bf0b0d077a": [],
            "66a396dfa71545bf0b0d077b": [],
            "66a396dfa71545bf0b0d077c": [],
            "66a396dfa71545bf0b0d077d": []
        };

        // Organize answer keys by student.
        answerKeys.forEach(answer => {
            const studentId = answer.student.toString(); // Convert ObjectId to string for matching
            if (studentIds[studentId]) {
                studentIds[studentId].push(answer._id);
            }
        });

        let data = [];

        // Create answer sheets for each student.
        for (const [studentId, answers] of Object.entries(studentIds)) {
            let sheet = {
                examPaper: examPaperId,
                student: ObjectId(studentId), // Convert string back to ObjectId
                totalQuestions: 30, // Update this if you have the actual count of questions.
                answers: answers,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            data.push(sheet);
        }

        // Insert the new answer sheets into the collection.
        const result = db.getCollection('answersheets').insertMany(data);
        // console.log(`${result} answer sheets inserted successfully.`);
    }
} catch (error) {
    console.error("Error:", error);
}
