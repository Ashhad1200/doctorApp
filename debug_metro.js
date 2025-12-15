try {
    const config = require('./metro.config.js');
    console.log("Metro config loaded successfully");
} catch (error) {
    console.error("Error loading metro config:", error);
}
